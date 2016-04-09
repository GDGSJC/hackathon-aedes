package com.example.saemi.hackadengue;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.os.AsyncTask;
import android.os.Environment;
import android.util.Log;
import android.widget.Toast;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

import retrofit.client.Response;
import retrofit.mime.TypedFile;

/**
 * Created by SAEMI on 08/04/2016.
 */
public class UploadSync  extends AsyncTask<String, String, Boolean>{

    private final static String TAG = UploadSync.class.getSimpleName().toString();
    ProgressDialog mProgress;
    private Activity activity;
    private RestClient restClient;
    private String  zipPath=  Environment.getExternalStorageDirectory().toString() + "/hackaton/uploadFiles/";

    public UploadSync(Activity activity){
        this.activity = activity;
        restClient = new RestClient();
    }

    @Override
    public void onPreExecute() {
        mProgress = new ProgressDialog(activity);
        mProgress.setMessage("Fazendo upload dos arquivos...");
        mProgress.setCancelable(true);

        mProgress.setButton("Cancelar", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                return;
            }
        });
        mProgress.show();
    }


    @Override
    protected Boolean doInBackground(String... params) {


        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddhhmmss");
            String fileName =dateFormat.format(new Date()) + ".zip";

            if (!FileHelper.zip(params[0], zipPath, fileName, false) ) {
                Toast.makeText(activity, "Falha ao compactar o arquivo", Toast.LENGTH_LONG).show();
                return false;
            }

            File zipFile = new File(zipPath + fileName);
            if (zipFile==null) {
                Toast.makeText(activity,"Tire uma foto primeiro por favor", Toast.LENGTH_LONG).show();
                return false;
            }

            TypedFile typedFile = new TypedFile("multipart/form-data", zipFile);
            Response response = restClient.getService().uploadSync(typedFile);

            if (response == null){
                Log.e(TAG, "Falha ao enviar");
                return  false;
            }
            if (response.getStatus()==200) {
                Log.e(TAG, "Sucesso ao enviar  - 200 status");
            } else {
                Log.e(TAG, "Falha ao enviar - status - " + response.toString());
            }

        } catch (Exception e) {
            //throw new RuntimeException(e);
            Log.e(TAG, e.getMessage().toString());
            return false;
        }

        return true;
    }

    @Override
    protected void onProgressUpdate(String... values) {
        mProgress.setMessage(values[0]);

    }

    @Override
    protected void onPostExecute(Boolean result) {
        mProgress.dismiss();
        if (result)
            Toast.makeText(activity, "Upload compactado com sucesso", Toast.LENGTH_LONG).show();
        else
            Toast.makeText(activity,"Falha ao compactar o Upload", Toast.LENGTH_LONG).show();


    }

}
