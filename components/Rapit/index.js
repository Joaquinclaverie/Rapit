import Avatar from "components/Avatar";
import useTimeAgo from "hooks/useTimeAgo";
import useDateTimeFormat from "hooks/useDateTimeFormat";
import Link from 'next/link'
import { useRouter } from 'next/router';
import styles from "./Rapit.module.css";

export default function Rapit ({ avatar, userName, content, createdAt, img, id }) {
    
    const timeago = useTimeAgo(createdAt)
    const createdAtFormated = useDateTimeFormat(createdAt)
    const router = useRouter()

    const handleArticleClick = (e) => {
        e.preventDefault()
        router.push(`/status/${id}`)
    }

    return (
    <>
        <article onClick={handleArticleClick} className={styles.article}>
            <div className={styles.div}>
                <Avatar src={avatar} alt={userName} />
            </div>
            <section>
                <header>
                    <strong>{userName}</strong>
                    <span> . </span>
                    <Link href={`/status/${id}`}>
                        <a className={styles.a}>
                            <time className={styles.time} title={createdAtFormated}>{timeago}</time>
                        </a>
                    </Link>
                </header>
                <p className={styles.p}>{content}</p>
                {img && <img className={styles.img} src={img} />}
            </section>
        </article>
    </>
    )
}