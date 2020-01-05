import React from "react";
import { connect } from "react-redux";
import { logout } from "../Store/Actions/auth";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Nav = styled.nav`
  background: #f9f9f9;
  color: #434343;
  font-family: "Roboto Slab", "serif";
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  user-select: none;
  a,
  a:visited {
    color: #434343;
  }
  a:hover {
    color: lightgrey;
    text-decoration: none;
  }
`;

function Header(props) {
  return (
    <Nav className="navbar">
      <span className="navbar-brand mb-0 h1">
        <Link to="/">tinynote</Link>
      </span>

      {props.auth.loggedIn && props.auth.user ? (
        <div className="userInfo">
          <Link to={"/user"}>{props.auth.user.name}</Link>

          {props.auth.user.role === "admin" && (
            <>
              <Link style={{ marginLeft: "1rem" }} to={"/admin"}>
                Admin
              </Link>
            </>
          )}

          <a
            style={{ marginLeft: "1rem" }}
            href="#"
            onClick={() => props.logout(props.auth.token)}
          >
            Logout
          </a>
        </div>
      ) : (
        <Link to={"/user"}>Login</Link>
      )}
    </Nav>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Header);
