const users = [] // popis svih korisnika

const addUser = ({ id, username, room }) => { // dodavanje korisnika, sa ID, imenom, i nazivom sobe

    username = username.trim().toLowerCase() // uređivanje podataka
    room = room.trim().toLowerCase()

    if (!username || !room) { //provjera postojanja argumenata korisnika, ili sobe
        return {
            error: "Username and room are required!"
        }
    }

    const existingUser = users.find((user) => { // provjera postojanja korisnika, u određenoj sobi
        return user.room === room && user.username === username
    })

    if (existingUser) { // provjera postojanja istog imena korisnika, u određenoj sobi
        return {
            error: "Username is in use"
        }
    }

    const user = { id, username, room } // kreiranje objekta korisnika
    users.push(user) // dodavanje korisnika u niz svih korisnika
    return {
        user
    }
}



const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    console.log(index)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {

    return users.find((user) => {
        return user.id === id
    })
}

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}