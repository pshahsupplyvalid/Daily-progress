import React from "react";
import {Dropdown} from "react-bootstrap";

function App2(){
    const[selectedCountry,setSelectedCountry] = useState("");

    function handleChange(eventKey){
        console.log("selected =", eventKey);
        setSelectedCountry(eventKey);

    }
    return(
        <div>
            
           <Dropdown>
            <Dropdown.Toggle>Click Me</Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>India </Dropdown.Item>
                <Dropdown.Item> China</Dropdown.Item>
                <Dropdown.Item> Bangladesh</Dropdown.Item>
                <Dropdown.Item> Nepal</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};
export default App2;