import { Card } from "react-bootstrap";
import "./App.css";

function App(){
    return (
        <div className ="App">
          <Card style={{ width :"20rem" , margin :"5"}}>
            <Card.Body> This is body</Card.Body>
          </Card>

          <Card style={{width :"20rem" ,  margin:"50"}}>
          <Card.Header as = "h6"> This is a header</Card.Header>
          <Card.Body> This is body</Card.Body>
          <Card.Footer  as ="h4"> This is a footer </Card.Footer>
        </Card>    
           
        </div>
    );
}

export default App;