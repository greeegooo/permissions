import { Injectable } from "@nestjs/common";
import { mainModule } from "process";
import { PutPermissionsDto } from "../dtos/put.permission.dto";

export class Node {
    initiative: string;
    value: string;
    children: Node[] = [];

    addChildren(values: string[]) {
        values.forEach(v => {
            let n = new Node();
            n.value = v;

            this.children.push(n);
        });
    }
}

@Injectable()
export class PermissionsService {

    private permissions: PutPermissionsDto[] = [];

    private nodes: Node[] = [];

    //Reconstruimos el objeto a travez del arbol
    async get() {
        // let field = this.permissions[0].fields[0];
        // let propName = field.property;
        // let propFields = field.access_key.split(',');

        // const PropConstructor = this.createConstructor(...propFields);
        // let field1 = new PropConstructor(...new Array(propFields.length).fill(true))

        // const FieldsConstructor = this.createConstructor(propName);
        // let fields = new FieldsConstructor(field1);

        // return {
        //     initiative: "",
        //     fields
        // };

        return this.nodes;
    }

    //Guardamos como arbol
    async put(request: PutPermissionsDto) {

        // this.permissions.push(request);
        
        let mainNode = new Node();
        mainNode.initiative = request.initiative;

        console.log("Recorriendo campos");
        request.fields.forEach(f => {

            console.log("Campo: " + JSON.stringify(f));
            
            let propertyNames = f.property.split('.');

            console.log("Campo: " + JSON.stringify(f) + " Prop names: " + propertyNames)

            if(propertyNames.length > 1) {

                console.log("Campo: " + JSON.stringify(f) + "Muchos prop names");
                let currentNode = new Node();

                propertyNames.forEach(propName => {

                    console.log("Campo: " + JSON.stringify(f) + "Muchos prop names: " + propName);

                    let auxNode = mainNode.children.find(n => n.value === propName);

                    if(auxNode) { 
                        console.log("Campo: " + JSON.stringify(f) + "Muchos prop names: " + propName + "ya existe");
                        currentNode = auxNode; 
                        console.log("Current node: " + JSON.stringify(currentNode));
                    }
                    else {
                        console.log("Campo: " + JSON.stringify(f) + "Muchos prop names: " + propName + "no existe");
                        auxNode = new Node();
                        auxNode.value = propName;
                        console.log("Current node: " + JSON.stringify(currentNode));
                        if(currentNode) {
                            console.log("Node: " + JSON.stringify(auxNode));
                            currentNode.children.push(auxNode);
                            console.log("Current node: " + JSON.stringify(currentNode));
                        }
                        
                        currentNode = auxNode;
                        console.log("Current node: " + JSON.stringify(currentNode));
                    }
                });
                console.log("NO HAY MAS PROPNAMES");
                currentNode.addChildren(f.access_key.split(','));

                console.log("Campo: " + JSON.stringify(f) + " Agregando nuevo nodo a main: " + JSON.stringify(currentNode));
                // mainNode.children.push(currentNode);
            }
            else {
                let node = new Node();
                console.log("Campo: " + JSON.stringify(f) + "Un solo prop name");
                node.value = propertyNames[0];
                node.addChildren(f.access_key.split(','));
                console.log("Campo: " + JSON.stringify(f) + " Agregando nuevo nodo a main: " + node);
                mainNode.children.push(node);
            }
        });
        console.log("FIN Recorriendo campos");
        this.nodes.push(mainNode);
    }

    private createConstructor(...fieldNames) {
        return class {
            constructor(...fieldValues) {
                fieldNames.forEach((name, idx) => {
                    this[name] = fieldValues[idx]
                });
            }
        }
    }
}