import React from 'react'
import {Alert , Card , Container} from 'react-bootstrap'


function AlertExample(){
    const [show , setShow] = UseState(true);

    if(show)
    return(
        <div>
            <container>
                <card>
            <Alert show={true} variant ='primary' dismissible>This is a Alert</Alert>
            <Alert.Heading>  Heading</Alert.Heading>
            </card>
 
            </container>
            
        </div>
        
    )
}



export default AlertExample