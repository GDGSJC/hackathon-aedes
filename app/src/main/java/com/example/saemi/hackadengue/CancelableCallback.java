package com.example.saemi.hackadengue;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;


import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;
/**
 * Created by SAEMI on 08/04/2016.
 */
public abstract class CancelableCallback<T>implements retrofit.Callback<T> {
    private static List<CancelableCallback> mList = new ArrayList<>();

    private boolean isCanceled = false;
    private Object mTag = null;

    public static void cancelAll() {
        Iterator<CancelableCallback> iterator = mList.iterator();
        while (iterator.hasNext()){
            iterator.next().isCanceled = true;
            iterator.remove();
        }
    }

    public static void cancel(Object tag) {
        if (tag != null) {
            Iterator<CancelableCallback> iterator = mList.iterator();
            CancelableCallback item;
            while (iterator.hasNext()) {
                item = iterator.next();
                if (tag.equals(item.mTag)) {
                    item.isCanceled = true;
                    iterator.remove();
                }
            }
        }
    }

    public CancelableCallback() {
        mList.add(this);
    }

    public CancelableCallback(Object tag) {
        mTag = tag;
        mList.add(this);
    }

    public static Boolean runningProcess(){

        return mList.size()>0;
    }

    public void cancel() {
        isCanceled = true;
        mList.remove(this);
    }

    @Override
    public final void success(T t, Response response) {
        if (!isCanceled)
            onSuccess(t, response);
        mList.remove(this);
    }

    @Override
    public final void failure(RetrofitError error) {
        if (!isCanceled)
            onFailure(error);
        mList.remove(this);
    }

    public abstract void onSuccess(T t, Response response);

    public abstract void onFailure(RetrofitError error);
}
