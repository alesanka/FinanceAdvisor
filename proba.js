import { UserDTO } from './src/dto/userDTO.js';

const userDTO = new UserDTO(
  1,
  'login',
  'A',
  'P',
  '1234567890',
  'aMed@iaList.com',
  'client'
);

userDTO.email = 'ihi@mail.com';

console.log(userDTO);
