package com.example.saemi.hackadengue;

import retrofit.Callback;
import retrofit.client.Response;
import retrofit.http.Headers;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.mime.TypedFile;
import retrofit.mime.TypedString;

/**
 * Created by SAEMI on 08/04/2016.
 */


public interface NetworkInterceptor {

    @Multipart
    @POST("api/ocorrencias/team/:team")
    @Headers("Content-Type: application/json")
    String uploadFile(
            @Part("coordinates") String[] coordenadas,
            @Part("type") String type,
            @Part("description") String description);


    @POST("api/ocorrencias/:ocurid/attach")
    @Headers("multipart/form-data")
    String uploadImage(
            @Part("image") TypedFile imagem);

}
