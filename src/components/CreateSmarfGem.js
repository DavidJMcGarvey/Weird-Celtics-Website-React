import React, { Component } from 'react';
import Form from './Form';
import ImageUploader from 'react-images-upload';

// Create course component
export default class CreateSmarfGem extends Component {
  constructor() {
    super();
    // this.state = { gems: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  state = {
    // userId: this.props.context.authenticatedUser.id,
    title: '',
    gems: [],
    errors: [],
  }

  onDrop(gem) {
    this.setState({
      gems: this.state.gems.concat(gem),
    });
    // console.log(this.state.gems);
  }

  render() {

    const {
      title,
      gems,
      errors
    } = this.state;

    console.log(this.state.gems);

    const { context } = this.props;
    const authUser = context.authenticatedUser;

    return (
      <div className="bounds course--detail">
        <h1>Create Smarf Gems</h1>
        <div>
          <Form
            cancel={this.cancel}
            errors={errors}
            submit={this.submit}
            submitButtonText="Add to Collection"
            elements={() => (
              <React.Fragment>
                <div className="grid-66">
                  <div className="course--header">
                  <h4 className="course--label">Smarf Gem</h4>
                  <p>By {authUser.username}</p>
                  <div><input
                    id="title"
                    name="title"
                    type="text"
                    value={title}
                    onChange={this.change}
                    className="input-title course--title--input"
                    placeholder="What do you call this gem?" /></div>
                    </div>


                </div>
                <div className="grid-25 grid-right">
                  <div className="course--stats">
                    <ul className="course--stats--list">
                      <li className="course--stats--list--item">
                        <h4>Smarf Gem</h4>
                        <ImageUploader
                          id={gems}
                          withIcon={true}
                          buttonText='Choose gem'
                          onChange={this.onDrop}
                          imgExtension={['.jpg', '.gif', '.png', '.gif']}
                          maxFileSize={5242880}
                        />
                        {/* <div><input
                          id="gem"
                          name="gem"
                          type="blob"
                          value={gem}
                          onChange={this.change}
                          className="course--time--input"
                          placeholder="Smarf Gem..." /></div> */}
                      </li>
                    </ul>
                  </div>
                </div>
              </React.Fragment>
          )} />
        </div>
      </div>
    )
  }

  change = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState(() => {
      return {
        [name]: value
      };
    });
  }

  // Function to handle submit, calls method from context
  submit = () => {
    const { context } = this.props;
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const {
      userId,
      title,
      description,
      gem
    } = this.state;

    const emailAddress = context.authenticatedUser.emailAddress;
    const password = context.authenticatedUser.password;
    const smarfGem = {
      userId,
      title,
      description,
      gem
    };

    context.data.createSmarfGem(smarfGem, emailAddress, password)
      .then( errors => {
        if (errors.length) {
          this.setState({ errors });
        } else {
          context.actions.signIn(emailAddress, password)
            .then(() => {
              this.props.history.push(from);
              console.log(`SUCCESS! Smarf Gem: "${title}" now exists!`);
            });
        }
      })
      .catch( err => {
        console.log(err);
        this.props.history.push('/error');
      })
  }

  cancel = () => {
    this.props.history.push('/');
  }

}
