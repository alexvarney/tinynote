import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: "Roboto Slab", sans-serif;
  
  display: flex;
  align-items: center;
  color: #434343;
  
  input {
    border: none;
    background: #F9F9F9;
    font-size: 40px;
    padding-left: 0.5rem;
    border-radius: 0.5rem;
    margin-right: 1rem;
    margin-bottom: 1rem;
    display: inline-block;
    flex: 1 1 80%;
    color: #434343;
  }

  input:focus{
    outline: none;
  }
`;

const inputFlex = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`

export default function TitleEditor({value, onChange, onSave=()=>{}, note={_id:null}}) {

  const inputElement = useRef(null);

  const [isEditing, setEditing] = useState(false);
  const expand = () => {
      setEditing(true)
      setTimeout(()=>inputElement.current.focus(), 0);
      
  };

  const save = (e) => {
    e.stopPropagation();
    setEditing(false);
    onSave();
  }

  useEffect(() => {
    setEditing(false);
  }, [note._id])

  return (
    <Container onClick={expand}>
      <div style={{display: isEditing? 'inline': 'none'}}>
        <input ref={inputElement} value={value} onChange={onChange} />
        <i onClick={save} className="fas fa-check"></i>
      </div>
      <h1 style={{display: !isEditing? 'inline': 'none'}}>{value}</h1>
    </Container>
  );
}
