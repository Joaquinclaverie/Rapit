import { firestore } from 'firebas/admin'

export default (req, res) => {
    const { query } = req
    const { id } = query

    firestore
        .collection('rapits')
        .doc(id)
        .get()
        .then(doc => {
            const data = doc.data()
            const id = doc.id
            const { createdAt } = data

            res.json({
                ...data,
                id,
                createdAt: +createdAt.toDate()
            })
        })
        .catch(() => {
            res.status(404).end()
        })
}