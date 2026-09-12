import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

// Used for PATCH — every field becomes optional so the client
// only has to send the fields it actually wants to change.
// Same as CreateUserDto: no `image` field — that's handled via the
// uploaded "photo" file, not a body property.
export class UpdateUserDto extends PartialType(CreateUserDto) {}
