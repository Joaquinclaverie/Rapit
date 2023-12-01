import Rapit from 'components/Rapit'
import { firestore } from 'firebas/admin'
import { useRouter } from 'next/router'

export default function DevitPage(props) {
    const router = useRouter()

    if (router.isFallback) return "Loading..."
    
    return (
        <>
            <Rapit {...props} />
            <style jsx>{``}</style>
        </>
    )
}

export async function getStaticPaths () {
    return {
        paths: [],
        fallback: true,
    }
}

export async function getStaticProps (context) {
    const { params } = context
    const { id } = params
    
    return firestore
        .collection('rapits')
        .doc(id)
        .get()
        .then(doc => {
            const data = doc.data()
            const id = doc.id
            const { createdAt } = data

            const props = {
                ...data,
                id,
                createdAt: +createdAt.toDate()
            }

            return { props }
        })
        .catch(() => {
            return { props: {} }
        })
}