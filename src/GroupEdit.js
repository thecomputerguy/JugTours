import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import AppNavbar from './AppNavbar';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import {instanceOf} from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';

class GroupEdit extends Component{

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    emptyItem = {
        name: '',
        address: '',
        city: '',
        stateOrProvince: '',
        country: '',
        postalCode: '',
    };

    constructor(props){
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount(){
        if(this.props.match.params.id !== 'new'){
           const group = await fetch(`/api/group/${this.props.match.params.id}`, {credentials: 'include'}).json();
            this.setState({
                item: group,
            });
        }
    }

    handleChange(event){

        const {name, value} = event.target;
        //validation should be triggered here. Not doing as of now...
        let item  = {...this.state.item};
        item[name] = value;
        this.setState({
            item
        });
    }

    async handleSubmit(event){
        event.preventDefault();
        const {item, csrfToken} = this.state;

         await fetch("/api/group",{
            method: (item.id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': csrfToken,
            },
            credentials: 'include',
            body: JSON.stringify(item), 
        });
        this.props.history.push("/groups");
    }

    render(){
        const {item} = this.state;
        const title = <h2>{item.id ? 'Edit Group' : 'Add Group'}</h2>

        return (
            <div>
                <AppNavbar />
                <Container>
                        {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="name">Name:</Label>
                            <Input type="text" name="name" id="name" value={item.name || ''} onChange={this.handleChange} autoComplete="name" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Address:</Label>
                            <Input type="text" name="address" id="address" value={item.address || ''} onChange={this.handleChange} autoComplete="address-level1" />
                        </FormGroup>
                        <FormGroup>
                            <Label for="city">City:</Label>
                            <Input type="text" name="city" id="city" value={item.city || ''} onChange={this.handleChange} autoComplete="address-level1" />
                        </FormGroup>
                        <div className="row">
                            <FormGroup className="col-md-5 mb-3">
                                <Label for="stateOrProvince">State/Province:</Label>
                                <Input type="text" name="stateOrProvince" id="stateOrProvince" value={item.stateOrProvince || ''} onChange={this.handleChange} autoComplete="address-level1" />
                            </FormGroup>
                            <FormGroup className="col-md-5 mb-3">
                                <Label for="country">Country:</Label>
                                <Input type="text" name="country" id="country" value={item.country || ''} onChange={this.handleChange} autoComplete="address-level1" />
                            </FormGroup>
                            <FormGroup className="col-md-3 mb-3">
                                <Label for="postalcode">Postal Code:</Label>
                                <Input type="text" name="postalCode" id="postalCode" value={item.postalCode} onChange={this.handleChange} autoComplete="address-level1" />
                            </FormGroup>

                        </div>

                        <FormGroup>
                                <Button color="primary" type="submit">Save</Button>
                                <Button color="secondary" tag={Link} to="/groups">Cancel</Button>
                            </FormGroup>

                    </Form>

                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(GroupEdit));