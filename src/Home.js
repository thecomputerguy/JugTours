import React, {Component} from 'react';
import { Link } from "react-router-dom";
import './App.css';
import { Button, Container } from "reactstrap";
import AppNavbar from "./AppNavbar";
import { withCookies } from 'react-cookie';

class Home extends Component{

    state = {
        isAuthenticated: false,
        isLoading: true,
        user: undefined,
    }

    constructor(props){
        super(props);
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount(){
        const response = await fetch("/api/user", {credentials:'include'});
        const body = await response.text();

        if(body === ''){
            this.setState({isAuthenticated: false});
        }else{
            this.setState({isAuthenticated: true, user: JSON.stringify(body)});
        }

    }

    login(){
        let port = (window.location.port ? ':' + window.location.port : '');
        if(port === ':3000'){
            port = ':8080';
        }

        window.location.href = '//' + window.location.hostname + port + '/private';
    }

    logout(){

        fetch("/api/logout",{method: 'POST', credentials: 'include', headers:{
            'X-XSRF-TOKEN': this.state.csrfToken
        }}).then(res => res.json()).then(response =>{
            window.location.href = response.logoutUrl + "?id_token_hint=" + response.idToken + "&post_logout_redirect_uri=" + window.location.origin; 
        });
    }


    render(){
        const message = this.state.user ? <h2>Welcome, {this.state.user}!</h2> : <p>Please login to manage your jug tours.</p>
        const button = this.state.isAuthenticated ? 
        <div>
            <Button color="link"><Link to="/groups">Manage Jug Tours!</Link></Button>
            <Button color="link" onClick={this.logout}>Logout</Button>
        </div> :
        <Button color="primary" onClick={this.login}>Login</Button>

        return (<div>
            <AppNavbar/>
            <Container fluid>
                {message}
                {button}
            </Container>
        </div>);
    }
}

export default withCookies(Home);