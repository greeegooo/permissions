import { ArgumentMetadata, HttpException, HttpStatus, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class PropertyValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value || this.isEmpty(value)) {
            throw new HttpException('No payload provided', HttpStatus.BAD_REQUEST);
        }
    }

    private isEmpty(value: any): boolean {
        return Object.keys(value).length < 1;
    }
}

