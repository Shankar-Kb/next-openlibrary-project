import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Card, Button } from 'antd';

export default function SearchHook(query, pageNumber) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [books, setBooks] = useState([])
  const [hasMore, setHasMore] = useState(false)

  useEffect(() => {
    setBooks([])
  }, [query])

  useEffect(() => {
    setLoading(true)
    setError(false)
    let cancel
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: { q: query, page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {

      console.log(res.data.docs);
      setBooks(prevBooks => {

        return [...new Set([...prevBooks, ...res.data.docs.map(( elem, index ) => (
            <div key={index} className="book-box">

              <Card 
                 //style={{ width: 300 }}
                 title={ elem.isbn && <Link className="card-title" href={`/book/${elem.isbn[0]}`}><a>{elem.title}</a></Link> }
               >
                   
                { false && elem.cover_i && <img className="book-thumbnail-image" src={`http://covers.openlibrary.org/b/id/${elem.cover_i}-M.jpg`} alt="Book Thumbnail"/> }
                <p className="card-text"> Written by <b>{elem.author_name}</b> </p>
                <p> Pulblished in the year <b>{elem.first_publish_year}</b> </p>
                <p> Available in these languages: <b>{elem.language?.map(e => e.toUpperCase()).join(" ")}</b> </p>
                
                { elem.isbn && <Link href={`/book/${elem.isbn[0]}`}><a target='_blank'><Button>View Button</Button></a></Link>}
              </Card>
            </div>
           ))
        ])]
      })
      setHasMore(res.data.docs.length > 0)
      setLoading(false)
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [query, pageNumber])

  return { loading, error, books, hasMore }
}
