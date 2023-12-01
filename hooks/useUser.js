import { useState, useEffect } from 'react';
import { onAuthStateChange } from 'firebas/client'
import { useRouter } from 'next/router'

export const USER_STATUS = {
    NOT_LOGGED: null,
    NOT_KNOWN: undefined
}

export default function useUser() {
    const [user, setUser] = useState(USER_STATUS.NOT_KNOWN)
    const router = useRouter()

    useEffect(() => {
        onAuthStateChange(setUser);
    }, []);

    useEffect(() => {
        user === USER_STATUS.NOT_LOGGED && router.push('/')
    }, [user])

    return user
}