import React, { useState, useRef, useCallback } from 'react'
import SearchHook from './api/SearchHook.js'
import { Input, Spin, Row, Col } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Home = () => {
  const [query, setQuery] = useState('')
  const [pageNumber, setPageNumber] = useState(1)

  const {
    books,
    hasMore,
    loading,
    error
  } = SearchHook(query, pageNumber)

  const observer = useRef()
  const lastBookElementRef = useCallback(node => {
    if (loading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber(prevPageNumber => prevPageNumber + 1)
      }
    })
    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  function handleSearch(e) {
    setQuery(e.target.value)
    setPageNumber(1)
  }

  return (
    <>
      <Row>
        <Col span={12} offset={6}>
          <Input className="search-box" placeholder="Search for books" size="large" value={query} onChange={handleSearch} />
          {books.map((book, index) => {
            if (books.length === index + 1) {
              return <div ref={lastBookElementRef} key={index} className="book-box">{book}</div>
            } else {
              return <div key={index} className="book-box">{book}</div>
            }
          })}
          <div className="spinner-box">{loading && <Spin indicator={antIcon} />}</div>
          <div className="error-box">{error && 'No records found'}</div>
        </Col>
      </Row>
    </>
  )
}

export default Home;