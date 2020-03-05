import config from './config';

export default class Data {
  api(path, method = 'GET', body = null, requireAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;
  
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }

    if (requireAuth) {
      const encodedCredentials = btoa(`${credentials.emailAddress}:${credentials.password}`);

      options.headers['Authorization'] = `Basic ${encodedCredentials}`;
    }

    return fetch(url, options);
  }

  // Helper function that gets user from REST API
  async getUser(emailAddress, password) {
    const response = await this.api(`/users`, 'GET', null, true, { emailAddress, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      return null;
    }
    else {
      throw new Error();
    }
  }
  
  // Helper function that creates user and stores on REST API database
  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        return data.errors;
      });
    }
    else {
      throw new Error();
    }
  }

  // Helper function that creates course and stores on REST API database
  async createSmarfGem(smarfGem, emailAddress, password) {
    const response = await this.api('/smarf-gem', 'POST', smarfGem, true, {emailAddress, password});
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
          return data.message;
        });
    } 
    else {
      throw new Error();
    }
  }

  // Helper function that updates course
  async updateSmarfGem(smarfGem, emailAddress, password) {
    const response = await this.api(`/smarf-gem/${smarfGem.id}`, 'PUT', smarfGem, true, {emailAddress, password});
    if (response.status === 204) {
      return [];
    } 
    else if (response.status === 304) {
      return null;
      } else if (response.status === 400) {
        return response.json().then(data => {
          return data.message;
      });
    } else {
      throw new Error();
    }
  }

  // Helper function that deletes course from REST API database
  async deleteSmarfGem(id, emailAddress, password) {
    const response = await this.api(`/smarf-gem/${id}`, 'DELETE', null, true, {emailAddress, password});
    if (response.status === 204) {
      return response;
    } else if (response.status === 401) {
      return null;
    } else if (response.status === 403) {
      return response;
    } else {
      throw new Error();
    }
  }

}
