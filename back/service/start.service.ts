import { Document, Types } from "mongoose"
import { CommentModel, HubModel, PostModel, Role, RoleModel, UserModel } from "../models"
import { SecurityUtils } from "../utils"
import axios from "axios"


const markdownContent = "**Markdown content example**\n\nThis is a Markdown content example with an image!\n\n![Example Image](https://picsum.photos/200/300)";

export class StartService {
    static userRoles = async () => {
        const countRoles = await RoleModel.count().exec()
        if(countRoles !== 0 ){
            return 
        }   
    
        const rolesNames: string[] = ["admin", "guest"]
        const rolesRequest = rolesNames.map((name) => RoleModel.create({ name }))
        await Promise.all(rolesRequest)
    }

    static createUsers = async (): Promise<void> => {
        const countUsers = await UserModel.count().exec()
        if(countUsers !== 0 ){
            return 
        }
    
        const roles = await RoleModel.find().exec()
        
        const usersLoginsAndUsernames: any[] = 
        [{login:"admin@gmail.com",username:"admin"},{login:"guest@gmail.com",username:"guest"}]
        
        const usersRequest = usersLoginsAndUsernames.map(async (usersLoginsAndUsernames) => {
            
            let userRoles: (Document<unknown, {}, Role> & Omit<Role & {_id: string;}, never>)[] = [];
            const adminRole = roles.find((role) => role.name === "admin");
            const guestRole = roles.find((role) => role.name === "guest");

            if (usersLoginsAndUsernames.username == "admin") {
                if (adminRole && guestRole) {
                    userRoles = [adminRole, guestRole];
                }
            } else {
                if (guestRole) {
                    userRoles = [guestRole];
                }
            }
            await UserModel.create({
                login: usersLoginsAndUsernames.login,
                password: SecurityUtils.toSHA512("password"),
                username: usersLoginsAndUsernames.username,
                roles: userRoles,
                posts: [],
                profileImageUrl: "https://cdn.hero.page/0afb509c-1859-4ed9-a529-6c8ea2711b51-aesthetic-anime-and-manga-pfp-from-jujutsu-kaisen-chapter-233-page-3-pfp-3",
                backgroundImageUrl: "https://preview.redd.it/why-did-gojo-fire-his-hollow-purple-the-wrong-way-and-curve-v0-7lff23n81lhb1.png?auto=webp&s=304248697abd05b315bcbaa187ca4d8aa009b49a",
                description: "c'est moi (test)",
                joinDate: new Date(),
                follow: []
            })
        })
        await Promise.all(usersRequest)
    } 

    // sample data, only when there are no posts yet (password for all: "password")
    static seed = async (): Promise<void> => {
        if (await PostModel.count().exec() !== 0) {
            return
        }

        const guestRole = await RoleModel.findOne({ name: "guest" }).exec()
        const usernames = ["alice", "bob", "carol"]
        for (const username of usernames) {
            if (await UserModel.exists({ username })) continue
            await UserModel.create({
                login: `${username}@gmail.com`,
                password: SecurityUtils.toSHA512("password"),
                username,
                roles: guestRole ? [guestRole] : [],
                profileImageUrl: `https://i.pravatar.cc/150?u=${username}`,
                backgroundImageUrl: `https://picsum.photos/seed/${username}/1200/400`,
                description: `Hello! My name is ${username}`,
                joinDate: new Date(),
                followers: [],
                following: []
            })
        }

        const hubs = [
            {
                name: "python", description: "Everything Python", admins: ["alice"],
                profileImageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
                coverImageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&h=400&fit=crop"
            },
            {
                name: "javascript", description: "JS, TS and Node", admins: ["bob"],
                profileImageUrl: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
                coverImageUrl: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=1200&h=400&fit=crop"
            }
        ]
        for (const hub of hubs) {
            if (await HubModel.exists({ name: hub.name })) continue
            await HubModel.create({
                ...hub,
                users: usernames,
                creationDate: new Date()
            })
        }

        const posts = [
            { username: "alice", hubname: "python", content: "**List comprehensions** are underrated:\n\n```python\nsquares = [x * x for x in range(10)]\n```" },
            { username: "bob", hubname: "javascript", content: "TIL `Array.prototype.at(-1)` gets the last element. No more `arr[arr.length - 1]`." },
            { username: "carol", hubname: null, content: markdownContent },
            { username: "alice", hubname: null, content: "First day on tweetdev, hi everyone!" },
            { username: "bob", hubname: "python", content: "Coming from JS, what should I learn first in Python?" }
        ]
        for (let i = 0; i < posts.length; i++) {
            const p = posts[i]
            const others = usernames.filter((u) => u !== p.username)
            const post = await PostModel.create({
                ...p,
                like: others.map((username, emojiIndex) => ({ username, emojiIndex })),
                comments: [],
                // spread over the last hours so the feed has an order
                creationDate: new Date(Date.now() - i * 3600 * 1000),
                program: null
            })
            const comment = await CommentModel.create({
                description: "Nice one!",
                username: others[0],
                postId: post._id,
                creationDate: new Date()
            })
            await PostModel.updateOne({ _id: post._id }, { $push: { comments: comment._id } })
        }
    }

    static createUser = async (): Promise<void> => {

        const roles = await RoleModel.find().exec();
        
        // Assuming this fetches 10 random users from RandomUser API
        const { data } = await axios.get('https://randomuser.me/api');
        const usersData = data.results;

        const usersRequest = usersData.map(async (userData: any) => {
            const first = userData.name.first;
            const last = userData.name.last;
            const login = `${first}.${last}`.toLowerCase() + "@gmail.com"
            const username = `${first}-${last}`.toLowerCase();  
            const profileImageUrl = userData.picture.thumbnail;
            const backgroundImageUrl = userData.picture.large;
            const description = `Hello! My name is ${first} ${last}`;

            // Determine roles for the user
            let userRoles: (Document<unknown, {}, Role> & Omit<Role & { _id: string; }, never>)[] = [];
            const adminRole = roles.find((role) => role.name === "admin");
            const guestRole = roles.find((role) => role.name === "guest");

            if (username === "admin") {
                if (adminRole && guestRole) {
                    userRoles = [adminRole, guestRole];
                }
            } else {
                if (guestRole) {
                    userRoles = [guestRole];
                }
            }
            // Create the user
            await UserModel.create({
                login,
                password: SecurityUtils.toSHA512("Respons11"),
                username,
                roles: userRoles,
                posts: [],
                profileImageUrl,
                backgroundImageUrl,
                description,
                joinDate: new Date(),
                follow: []
            });

            await PostModel.create({
                content: markdownContent,
                like: [],
                comments: [],
                creationDate: new Date(),
                username,
                hubname: null,
                program: null
            })
        });

        await Promise.all(usersRequest);
    }
}
