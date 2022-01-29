import { Injectable } from "@nestjs/common";
import { PutPermissionsDto } from "../dtos/put.permission.dto";

@Injectable()
export class PermissionsService {

    async put(request: PutPermissionsDto) {
        return null;
    }
}