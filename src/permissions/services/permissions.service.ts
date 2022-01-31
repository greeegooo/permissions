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

            let propertyNames = f.property.split('.');

            if(propertyNames.length > 1) {

                let currentNode = null;
                let currentChildren = mainNode.children;
                propertyNames.forEach(propName => {

                    let auxNode = currentChildren.find(n => n.value === propName);

                    if(!auxNode) { 
                        auxNode = new Node();
                        auxNode.value = propName;
                        if(currentNode) {
                            currentNode.children.push(auxNode);
                        }
                        else {
                           mainNode.children.push(auxNode); 
                        }
                    }

                    currentNode = auxNode;
                    currentChildren = currentNode.children; 
                });
                
                currentNode.addChildren(f.access_key.split(','));
            }
            else {

                let propName = propertyNames[0];
                let currentNode = mainNode.children.find(n => n.value === propName);
                if(currentNode) {
                    currentNode.addChildren(f.access_key.split(','));
                }
                else {
                    let node = new Node();
                    node.value = propertyNames[0];
                    node.addChildren(f.access_key.split(','));
                    mainNode.children.push(node);
                }
            }
        });

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