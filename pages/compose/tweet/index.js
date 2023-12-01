import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from "./Tweet.module.css"
import Button from "components/Button"
import useUser from "hooks/useUser"
import { getDownloadURL } from "firebase/storage";
import { addRapit, uploadImage } from 'firebas/client'
import Head from 'next/head'
import Avatar from 'components/Avatar'

const COMPOSE_STATES = {
    USER_NOT_KNOWN: 0,
    LOADING: 1,
    SUCCESS: 2,
    ERROR: -1
}

const DRAG_IMAGE_STATES = {
    ERROR: -1,
    NONE: 0,
    DRAG_OVER: 1,
    UPLOADING: 2,
    COMPLETE: 3
}

export default function ComposeTweet () {

    const user = useUser()
    const [status, setStatus] = useState(COMPOSE_STATES.USER_NOT_KNOWN)
    const [message, setMessage] = useState("")
    const [drag, setDrag] = useState(DRAG_IMAGE_STATES.NONE)
    const [uploadTask, setUploadTask] = useState(null)
    const [imgURL, setImgURL] = useState(null)
    const router = useRouter()

    useEffect(() => {
      if (uploadTask) {
        uploadTask.then((snapshot) => {
          getDownloadURL(snapshot.ref).then(setImgURL)
        })
      }
    }, [uploadTask])

    const handleChange = (event) => {
        const { value } = event.target
        setMessage(value)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        setStatus(COMPOSE_STATES.LOADING)
        addRapit({
            avatar: user.avatar,
            content: message,
            userId: user.uid,
            img: imgURL
        })
        .then(() => {
            router.push('/home')
        })
        .catch(err => {
            console.error(err)
            setStatus(COMPOSE_STATES.ERROR)
        })
    }

    const handleDragEnter = e => {
        setDrag(DRAG_IMAGE_STATES.DRAG_OVER)
    }

    const handleDragLeave = e => {
        setDrag(DRAG_IMAGE_STATES.NONE)
    }

    const handleDrop = e => {
        e.preventDefault()
        setDrag(DRAG_IMAGE_STATES.NONE)
        const file = e.dataTransfer.files[0]
        const uploadTask = uploadImage(file)
        setUploadTask(uploadTask)
    }

    const isButtonDisabled = !message.length || status === COMPOSE_STATES.LOADING

    return (
        <>
            <Head>
                <title>Crear un Devit / Rapter</title>
            </Head>
            <section className='form-container'>
              { user && (
                <section className='avatar-container'>
                  <Avatar src={user.avatar} />
                </section>
              )}
            </section>
            <form onSubmit={handleSubmit}>
                <textarea 
                    onChange={handleChange}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={styles.textarea} 
                    placeholder="Que esta pasando?">
                </textarea>
                {imgURL && (
                  <section className='remove-img'>
                    <button onClick={() => setImgURL(null)}>x</button>
                    <img src={imgURL} />
                  </section>)}
                <div>
                    <Button disabled={isButtonDisabled}>Rapitear</Button>
                </div>
            </form>
        <style jsx>{`
        div {
          padding: 15px;
        }
        .avatar-container {
          padding-top: 20px;
          padding-left: 10px;
        }
        section {
          position: 'relative';
        }
        button {
          background: rgba(0, 0, 0, 0.3);
          border: 0;
          border-radius: 999px;
          color: #fff;
          font-size: 24px;
          width: 32px;
          height: 32px;
          top: 15px;
          position: absolute;
          right: 15px;
        }
        .form-container {
          align-items: flex-start;
          display: flex;
        }
        .remove-img {
          position: relative;
        }
        form {
          padding: 10px;
        }
        img {
          border-radius: 10px;
          height: auto;
          width: 100%;
        }
        textarea {
          border: ${drag === DRAG_IMAGE_STATES.DRAG_OVER
            ? "3px dashed #09f"
            : "3px solid transparent"};
          border-radius: 10px;
          font-size: 21px;
          min-height: 200px;
          padding: 15px;
          outline: 0;
          resize: none;
          width: 100%;
        }
        `}</style>
        </>
    )
}