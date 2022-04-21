
const DEFAULT_PROFILE_PIC_URL = ''; // TODO

export class User {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  emailAddress: string;
  address: Address;
  cif: string;
  id: string;
  lastAccess: Date;
  telephone?: string;
  dateOfBirth?: string;
  profilePictureUrl?: string = DEFAULT_PROFILE_PIC_URL;
  isRegistered: boolean;

  // needs to be explicitly set to `true` if the user is a guest user
  isGuest: boolean;

  get fullName() {
    let fullName = '';
    if (this.firstName) {
      fullName += this.firstName + ' ';
    }
    if (this.middleName) {
      fullName += this.middleName + ' ';
    }
    if (this.lastName) {
      fullName += this.lastName;
    }
    return fullName;
  }

  static isDefaultProfilePicture(pictureUrl: string): boolean {
    return pictureUrl === DEFAULT_PROFILE_PIC_URL;
  }
}

export class Address {
  street1: string;
  street2: string;
  street3: string;
  street4: string;
  city: string;
  state: string;
  zip: string;

  static getFullAddress(address: Address): string {
    let addressInString = '';
    if (address.street1) {
      addressInString += address.street1;
      addressInString += ', ';
    }
    if (address.street2) {
      addressInString += address.street2;
      addressInString += ', ';
    }
    if (address.street3) {
      addressInString += address.street3;
      addressInString += ', ';
    }
    if (address.street4) {
      addressInString += address.street4;
      addressInString += ', ';
    }
    addressInString += address.city + ', ' + address.state + ', ' + address.zip;
    return addressInString;
  }

}

export class SecurityQuestion {
  questionId: string;
  questionText: string;
  answer: string;
}
