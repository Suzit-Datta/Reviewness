import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto.js';

// Used for PATCH — every field becomes optional so the client
// only has to send the fields it actually wants to change.
// Same as CreatePostDto: no `image` field — that's handled via the
// uploaded "photo" file, not a body property.
export class UpdatePostDto extends PartialType(CreatePostDto) {}
