package com.example.saemi.hackadengue;

import android.app.Application;

import retrofit.RequestInterceptor;
import retrofit.RestAdapter;

/**
 * Created by SAEMI on 08/04/2016.
 */
public class BaseApplication extends Application {

    //web service url...
    public static final String BASE_URL ="https://github.com/GDGSJC/hackathon-aedes/";


    private NetworkInterceptor networkInterceptor;

    @Override
    public void onCreate() {
        super.onCreate();

        //the rest client...
        RestAdapter restAdapter = new RestAdapter.Builder()
                .setEndpoint(BASE_URL)
                .setLogLevel(RestAdapter.LogLevel.FULL)
                .setRequestInterceptor(new RequestInterceptor() {
                  @Override
                    public void intercept(RequestFacade requestFacade) {
                        if (BASE_URL.contains("10.0.2.2"))
                            requestFacade.addHeader("Host", "localhost");
                    }
                })
                .build();

        //applying the interceptor..
        networkInterceptor = restAdapter.create(NetworkInterceptor.class);

    }

    public NetworkInterceptor getNetworkInterceptor() {
        return networkInterceptor;
    }
}