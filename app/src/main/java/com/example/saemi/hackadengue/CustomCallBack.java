package com.example.saemi.hackadengue;

import javax.net.ssl.SSLEngineResult;

import retrofit.Callback;
import retrofit.client.Response;

/**
 * Created by SAEMI on 09/04/2016.
 */
public abstract class CustomCallBack<T extends StatusResponse> implements Callback<T> {
    @Override public final void success(T data, Response response) {
        if (data.getStatus() == SSLEngineResult.Status.OK) {
            success(data);
        } else {

        }
    }
        public abstract void success(T data);
    }