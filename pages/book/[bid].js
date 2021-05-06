import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Image, Row, Col } from 'antd';



const DetailsPage = () => {
    
    const [bookTitle, setBookTitle] = useState("");
    const [bookPublishYear, setBookPublishYear] = useState("");
    const [bookURL, setBookURL] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [authorURL, setAuthorURL] = useState("");
    const [bookImage, setBookImage] = useState("");

    const router = useRouter();
    const { bid } = router.query;

    
    useEffect(() => {
        
        if( bid !== undefined){
        axios.get(`https://cors-anywhere.herokuapp.com/http://openlibrary.org/api/volumes/brief/isbn/${bid}.json`, {
          
        //headers: { 'Access-Control-Allow-Origin': '*' },
        //crossorigin:true,
        //withCredentials: false
         
        })
             .then(res => {

                 //console.log(res.data.records);
                 const key = Object.keys(res.data.records)[0];
                 
                 const object = res.data.records[key];
                 setBookTitle(object.data.title);
                 setBookPublishYear(object.publishDates[0]);
                 setBookURL(object.data.url);
                 setAuthorName(object.data.authors[0].name);
                 setAuthorURL(object.data.authors[0].url);
                 setBookImage(object.data.cover.medium);
                 //console.log(res.data.records[key].data.url);
            })
              .catch((error) => console.log(error))
              }

    }, [bid])

    return(

        <div className="details-page-box">
            <Row>
                <Col span={12} offset={6}>

                    <Row>
                        <Col span={8} >{bookImage && <Image className="book-image" src={bookImage} alt="Book Thumbnail" />} </Col>

                        <Col span={16} >
                            {bookURL && <a href={bookURL} target='_blank'> <h1> {bookTitle} </h1> </a>}
                            {bookPublishYear && <h2> Written in the year: {bookPublishYear} </h2>}
                            {authorName && <a href={authorURL} target='_blank'> <h2> Written by: {authorName} </h2> </a>}
                        </Col>
                    </Row>

                </Col>
            </Row>
        </div>

    )
}

export default DetailsPage;