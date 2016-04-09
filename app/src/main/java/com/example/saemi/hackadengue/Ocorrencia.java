package com.example.saemi.hackadengue;

import com.google.gson.annotations.SerializedName;

/**
 * Created by SAEMI on 09/04/2016.
 */
public class Ocorrencia {

    @SerializedName("id")
    int mId;

    @SerializedName("team")
    int mTeam;

    @SerializedName("coordinates")
    double[] mCoordenadas;

    @SerializedName("type")
    int mType;

    @SerializedName("description")
    String mDescription;

    @SerializedName("status")
    String mStatus;

    public Ocorrencia(int id, int team, double[] mCoordenadas, int mType, String mDescription, String status) {
        this.mId = id;
        this.mTeam = team;
        this.mCoordenadas = mCoordenadas;
        this.mDescription = mDescription;
        this.mStatus = status;
        this.mType = mType;
    }

}
