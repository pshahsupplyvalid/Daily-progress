import React from "react";
import {useState} from "react";
import {Button} from "react-bootstrap";


function ButtonComponent(){
    const [isLoading , SetIsLoading]= useState(false);
    const handleChange =()=>{
        setIsLoading(true);

        setTimeout = (()=>{
            setIsLoading(false);

        }, 2000);
    };
    return(

        <div>
            Button Component 
            <br/>
            {/* Active Disabled */}
            <Button variant ="primary" disabled={isLoading} onClick={handleChange}>
                API call
            </Button>
        </div>
    );
}

export default ButtonComponent;