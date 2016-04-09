package com.example.saemi.hackadengue;


import javax.net.ssl.SSLEngineResult;

/**
 * Created by SAEMI on 09/04/2016.
 */
public interface StatusResponse {
    SSLEngineResult.Status getStatus();
}
