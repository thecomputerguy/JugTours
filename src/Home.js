import React, {Component} from 'react';
import { Link } from "react-router-dom";
import './App.css';
import { Button, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";

export default class Home extends Component{

    render(){
        return (<div>
            <AppNavbar/>
            <Container fluid>
                <Button color="link"><Link to="/groups">Manage Jug Tours</Link></Button>
            </Container>
        </div>);
    }
}