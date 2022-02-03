import { Injectable } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { request } from "express";
import { object } from "joi";
import { Connection } from "mongoose";
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

    constructor(@InjectConnection() private connection: Connection) {}

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

        // let initiativeNode = this.nodes.find(n => n.initiative === 'risk');

        // console.log("Entrando a createFields");
        // let fields = this.createFields(initiativeNode.children);
        // console.log("Salimos de createFields");

        // return {
        //     initiative: initiativeNode.initiative,
        //     fields
        // };


        // return this.nodes;

        let model = (await this.connection.collection('models').find().toArray())[0];
        let initiative = (await this.connection.collection('permissions').find({initiative: 'risk'}).toArray())[0];
        console.log(model);
        console.log(initiative);

        this.setPropsToTrue(model, initiative.fields);

        return model;
    }

    private setPropsToTrue(permissions: Object, requestProps: string[]) {

        console.log(`PermissionsObject: ${JSON.stringify(permissions)}. RequestProps: ${requestProps}`);

        requestProps.forEach(reqProp => {
            
            let propsNames = reqProp.split('.');
            let isNested = propsNames.length > 1;

            let prop = propsNames[0];
            let value = permissions[prop];
            if(!!value) {
                if(isNested) {
                    console.log(`HasValue. IsNested. Prop: ${prop}. Value: ${value}`);

                    let tail = propsNames.slice(1).join('.');
                    console.log(`Tail: ${tail}`);
                    this.setPropsToTrue(value, [tail]);
                }
                else {
                    console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
                    // Object.assign(value, true);
                    value = true;
                    console.log(`HasValue. NotNested. Prop: ${prop}. Value: ${JSON.stringify(value)}`);
                }
            }
            else {
                console.log(`Has not value. Prop: ${prop}. Value: ${value}`);
                permissions[prop] = true;
            }
        });
    }

    private createFields(elements: Node[]) {

        let fields = [];

        console.log("createFields input:" + JSON.stringify(elements));
        elements.forEach(element => {

            if(element.children.length > 0 && element.children.some(c => c.children.length > 0)) {
                fields.push(...this.createFields(element.children));
            }
            else {
                fields.push(this.createField(element));
            }
            
        });

        console.log("createFields output:" + JSON.stringify(fields));
        return fields;
    }

    private createField(element: Node): Object {
        console.log("createField input: " + JSON.stringify(element));
        let childrenFields = element.children.map(c => c.value);
        let Field = this.createConstructor(...childrenFields);
        let field = new Field(...new Array(childrenFields.length).fill(true));
        console.log("createField output: " + JSON.stringify(field));
        return field;
    }

    //Guardamos como arbol
    async put2(request: PutPermissionsDto) {

        // this.permissions.push(request);
        
        //Obtener el modelo user base

        //Contrastar campo a campo
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
        this.connection.collection('permissions').insertOne(mainNode);
    }

    //Guardamos como lista de strings
    async put(request: PutPermissionsDto) {

        let fields = [];
        request.fields.forEach(field => {
            let accessKeys = field.access_key.split(',');
            accessKeys.forEach(key => fields.push(`${field.property}.${key}`))
        });

        let initiative = {
            initiative: request.initiative,
            fields
        };

        this.connection.collection('permissions').insertOne(initiative);
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