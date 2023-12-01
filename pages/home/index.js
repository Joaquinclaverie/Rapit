import { useEffect, useState } from 'react'
import styles from './Home.module.css';
import Link from 'next/link'
import Head from 'next/head'
import Rapit from 'components/Rapit';
import useUser from 'hooks/useUser';
import { fetchLatestRapits } from 'firebas/client'
import Create from 'components/Icons/Create';
import Home from 'components/Icons/Home';
import Search from 'components/Icons/Search';

export default function HomePage () {

    const [timeline, setTimeline] = useState([])
    const user = useUser()

    useEffect(() => {
        user && fetchLatestRapits()
        .then(setTimeline)
        // para limpiar las subscripciones de un componente desmontado
        // const unsubscribe = listenLatestDevits(setTimeline)
        // return () => unsubscribe && unsubscribe()
    }, [user])

    return (
        <>
            <Head>
                <title>Inicio / Rapter</title>
            </Head>
            <div>
                <header className={styles.header} > 
                    <h2 className={styles.h2}>Inicio</h2>
                </header>
                <section className={styles.section} >
                    {timeline.map(({ createdAt, img, id, username, avatar, content, userId }) => (
                            <Rapit  
                                key={id}
                                createdAt={createdAt}
                                username={username}
                                avatar={avatar}
                                content={content}
                                id={id}
                                img={img}
                                userId={userId}
                            />
                    ))}
                </section>
                <nav className={styles.nav} >
                    <Link href="/home">
                        <a>
                            <Home width={32} height={32} stroke="#09f" />
                        </a>
                    </Link>
                    <Link href="/compose/tweet">
                        <a>
                            <Create width={32} height={32} stroke="#09f" />
                        </a>
                    </Link>
                    <Link href="/compose/tweet">
                        <a>
                            <Search width={32} height={32} stroke="#09f" />
                        </a>
                    </Link>
                </nav>
            </div>
        </>
    )
}