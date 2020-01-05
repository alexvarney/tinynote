import React from "react";
import styled from "styled-components";
import ReactMarkdown from "react-markdown";

const Container = styled.div`
  padding: 1rem 1rem 0.15rem 1rem;
  margin: 0.75rem 0.5rem 0rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.1);
  background: ${props => (props.selected ? "#838383" : "#ffffff")};
  color: ${props => (props.selected ? "#ffffff" : "#434343")};
  cursor: pointer;

  h1 {
    font-family: "Roboto Slab", serif;
    font-style: normal;
    font-weight: normal;
    font-size: 24px;
    line-height: 21px;
    margin-bottom: 0.75rem;
  }
`;

const TextContainer = styled.div`
  font-family: "Open Sans", sans-serif;
  font-size: 12px;
  text-overflow: ellipsis;
  overflow: hidden;
  max-height: 54px;
  min-height: 2rem;
  margin-bottom: 0.25rem;

  h1, h2, h3, h4, h5, h6{
    font-size: 12px;
    font-weight: bold;
  }

`;

export default function NoteListCard({ note, onClick, selected = false }) {
  return (
    <Container onClick={onClick} selected={selected}>
      <h1>{note.noteTitle}</h1>
      <TextContainer>
        <ReactMarkdown source={note.noteMarkdown} />
      </TextContainer>
    </Container>
  );
}
