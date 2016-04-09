package com.example.saemi.hackadengue;

/**
 * Created by SAEMI on 08/04/2016.
 */

import retrofit.Callback;
import retrofit.client.Response;
import retrofit.http.Multipart;
import retrofit.http.POST;
import retrofit.http.Part;
import retrofit.mime.TypedFile;

public abstract interface UploadService {
    @Multipart
    @POST("/upload")
    public abstract void upload(@Part("file") TypedFile paramTypedFile, Callback<Response> paramCallback);

    @Multipart
    @POST("/upload")
    public abstract Response uploadSync(@Part("file") TypedFile paramTypedFile);
}
