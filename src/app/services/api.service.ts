import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {lastValueFrom} from 'rxjs';

const urlHttps = 'https://localhost:7054/api'

interface IApiProps {
  Id?: string;
  NameController: string;
  CustomEndpoint?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private httpClient: HttpClient) {}

  async create<T>(props: IApiProps, data: T): Promise<boolean> {
    try {
      console.log("Sending data to server:");
      console.log(JSON.stringify(data))
      const responce = await lastValueFrom(
        this.httpClient.post(
          `${urlHttps}/${props.NameController}`,
          JSON.stringify(data),
          {headers: {'Accept': 'text/plain', 'Content-Type': 'application/json'}}
        ));

      console.log(responce)
      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  async getById<T>(props: IApiProps & { Id: string }): Promise<T | null> {
    try {
      return await lastValueFrom(
        this.httpClient.get<T>(
          `${urlHttps}/${props.NameController}/${props.Id}`,
          { headers: this.jsonHeaders }
        ));
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async getAll<T>(props: IApiProps, params?: Record<string, string>): Promise<T[]> {
    try {
      const endpoint = props.CustomEndpoint
        ? `${props.NameController}/${props.CustomEndpoint}`
        : props.NameController;

      console.log(JSON.stringify(params));

      return await lastValueFrom(
        this.httpClient.get<T[]>(
          `${urlHttps}/${endpoint}`,
          { headers: this.jsonHeaders,
            params: params}
        ));
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  async update<T>(props: IApiProps & { id: string | undefined }, data: T): Promise<boolean> {
    try {
      console.log(JSON.stringify(data))
      await lastValueFrom(
        this.httpClient.put(
          `${urlHttps}/${props.NameController}/${props.id}`,
          JSON.stringify(data),
          { headers: this.jsonHeaders }
        ));

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  async delete(nameController: string, id: string): Promise<boolean> {
    try {
      await lastValueFrom(
        this.httpClient.delete(
          `${urlHttps}/${nameController}/${id}`,
          { headers: this.jsonHeaders }
        ));

      return true;
    } catch (e){
      console.error(e);
      return false;
    }
  }
}
