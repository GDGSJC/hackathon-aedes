package com.example.saemi.hackadengue;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import retrofit.RequestInterceptor;
import retrofit.RestAdapter;
import retrofit.converter.GsonConverter;

/**
 * Created by SAEMI on 08/04/2016.
 */
public class RestClient {

    private UploadService  uploadService;
    private String URL ="https://github.com/GDGSJC/hackathon-aedes/";

    public RestClient(){
        Gson localGson = new GsonBuilder().create();

        this.uploadService = ((UploadService)new RestAdapter.Builder()
                .setEndpoint(URL)
                .setConverter(new GsonConverter(localGson))
                .setRequestInterceptor(new RequestInterceptor()
                {
                    public void intercept(RequestInterceptor.RequestFacade requestFacade)
                    {   //Adicionando cabeçalho
                        if (URL.contains("10.0.2.2")) {
                            requestFacade.addHeader("Host", "localhost");
                        }
                    }
                })
                .build().create(UploadService.class));

    }



    public UploadService getService()
    {
        return this.uploadService;
    }

}
