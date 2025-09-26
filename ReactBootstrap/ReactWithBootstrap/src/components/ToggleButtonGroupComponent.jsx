import React from "react";
import {ToggleButton , ToggleButtonGroup} from"react-bootstrap";

function ToggleButtonGroupComponent(){
    const handleCheckbox=(e)=>{
        console.log(e);
    };
    return (
        <div>
            ToggleButtonGroup
            <br/>
            <br/>
            {/* CheckBox*/}
            <ToggleButtonGroup
            type="checkbox"
                defaultValue={[1,3]}
                onChange={handleCheckbox}>
            <ToggleButton id ="tbg-checkbox1">CheckBox 1</ToggleButton>
            <ToggleButton id ="tbg-checkbox2"> CheckBox 2</ToggleButton>
            <ToggleButton id ="tbg-checkbox3">CheckBox 3</ToggleButton>
            </ToggleButtonGroup>
        </div>




    )

}