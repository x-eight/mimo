// General
type ObjectType = "teacher" | "student"

//avatar
interface UserAvatar {

    thumbnail: string

    medium: string

    large: string

}

// User
interface User {
    id: string

    object: ObjectType

    username: string

    email:string

    password: string

    avatar: UserAvatar

    createdAt: number

    updatedAt: number

}

// Payment
type PaymentType = "visa" | "mastercard"

interface Payment {

    id: string

    object: ObjectType

    type: PaymentType

    createdAt: string

    updatedAt: string

}