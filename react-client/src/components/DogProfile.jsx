import React from 'react';
import { Card, Divider, Row, Col } from 'antd';
import { connect } from 'react-redux';
import SearchResult from './SearchResult';

const { Meta } = Card;

// props should pass dog object as this.props.dog and org object as this.props.org
// <DogProfile dog=? org=? />

class DogProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log(this.props.state);
  }

  render() {
    const { dog } = this.props.profile;
    const { org } = this.props.profile;
    // uncomment to use with props n get rid of the ones above
    // const { dog } = this.props;
    // const { org } = this.props;

    let stage = dog.lifestage.charAt(0).toUpperCase() + dog.lifestage.slice(1);
    if (dog.age) {
      stage += ` (age ${dog.age})`;
    }

    let temperament = '';
    if (dog.anxious && dog.aggressive) {
      temperament = 'anxiety, aggression';
    } else if (dog.anxious) {
      temperament = 'anxiety';
    } else if (dog.aggressive) {
      temperament = 'aggression';
    } else {
      temperament = 'none';
    }

    let specialNeeds = '';
    if (dog.diet && dog.medical) {
      specialNeeds = 'diet, medical';
    } else if (dog.diet) {
      specialNeeds = 'diet';
    } else if (dog.medical) {
      specialNeeds = 'medical';
    } else {
      specialNeeds = 'none';
    }

    const phone = `(${org.phone.slice(1, 4)}) ${org.phone.slice(4, 7)}-${org.phone.slice(7)}`;

    return (
      <div>
        <Row style={{ marginTop: 30, marginBottom: 30 }} >
          <Col span={10} offset={3} >
            <Card>
              <h1> {dog.name} </h1>
              <span style={{ fontWeight: 600, fontSize: 18, marginLeft: 5 }} > {dog.breed} {dog.mix ? 'mix' : ''} </span>
              <Divider type="vertical" />
              <span style={{ fontWeight: 600, fontSize: 16 }} > {dog.male ? 'Male' : 'Female'} </span>
              <Divider type="vertical" />
              <span style={{ fontWeight: 600, fontSize: 16 }} > {stage} </span>

              <Divider />

              <h2> About </h2>

              <h3 style={{ marginLeft: 20 }}> Health </h3>
              <div style={{ marginLeft: 40 }}>
                <span style={{ fontWeight: 700 }}> Size: </span> {dog.size}
              </div>
              <div style={{ marginLeft: 40 }}> {dog.fixed ? 'N' : 'Not n'}eutered/spayed </div>
              <div style={{ marginLeft: 40 }}>
                <span style={{ fontWeight: 700 }}> Special needs: </span> {specialNeeds}
              </div>

              <h3 style={{ marginLeft: 20, marginTop: 20 }}> Behavior </h3>
              <div style={{ marginLeft: 40 }}>
                <span style={{ fontWeight: 700 }}> Energy level: </span> {dog.energy_level}
              </div>
              <div style={{ marginLeft: 40 }}>
                <span style={{ fontWeight: 700 }}> Temperament concerns: </span> {temperament}
              </div>

              <h2 style={{ marginTop: 20 }} > Bio </h2>
              <div style={{ marginLeft: 20 }} > {dog.description} </div>
            </Card>
          </Col>
          <Col span={8} offset={1}>
            <Card
              style={{ width: 350 }}
              cover={<img alt="pupper" src={dog.photo} />}
            />
          </Col>
        </Row>
        <Row style={{ marginBottom: 50 }} >
          <Col span={10} offset={3}>
            <Card>
              <Meta title="Shelter Info" />
              <Divider />
              <h4> {org.name} </h4>
              <div style={{ marginTop: 10 }}> {org.address} </div>
              <div> {org.city}, {dog.state} {org.zipcode} </div>
              <div style={{ marginTop: 10 }}> {phone} </div>
            </Card>
          </Col>
        </Row>
        <SearchResult dog={dog} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  console.log(state);
  return state;
};

export default connect(mapStateToProps, null)(DogProfile);

// TODO: editable?????

// on clicking an item that will take us to a dog page,
// it will take the dog id from that item
// and initiate a get request that will call the get dog by id db query
// and get the org id from the result of that
// and call the get org by id db query
// and send the org info and dog info to the profile page component