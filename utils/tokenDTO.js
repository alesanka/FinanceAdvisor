export class TokenDTO {
    constructor(tokenObject) {
      this.accessToken = tokenObject.accessToken;
      this.refreshToken = tokenObject.refreshToken;
    }
  
    toJSON() {
      return {
        accessToken: this.accessToken,
        refreshToken: this.refreshToken
      };
    }
  }
  
  
