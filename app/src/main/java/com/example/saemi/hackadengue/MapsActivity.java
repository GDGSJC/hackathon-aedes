package com.example.saemi.hackadengue;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.provider.MediaStore;
import android.provider.Settings;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.location.LocationListener;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;


import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import retrofit.client.Response;
import retrofit.mime.TypedFile;
import retrofit.mime.TypedOutput;
import retrofit.mime.TypedString;

public class MapsActivity extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    final static int CAPTURE_IMAGE_ACTIVITY_REQUEST_CODE = 1;
    Uri uriImagem = null;
    static TextView detalhesImg = null;
    public ImageView uploadImage;
    MapsActivity foto = null;
    LocationListener locationListener;
    private Button uploadButton, photoButton,sendButton;
    private static final String TAG = MainActivity.class.getSimpleName();
    private double latitude;
    private double longitude;
    private String tipo;
    private String descricao;


    Bitmap bitmap = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        foto = this;

        //detalhesImg = (TextView) findViewById(R.id.textView);
        //endereco = (TextView) findViewById(R.id.textView2);
        uploadImage = (ImageView) findViewById(R.id.imageView2);
        photoButton = (Button) findViewById(R.id.tirar);

        photoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                String arquivo = "exemplo.jpg";
                ContentValues values = new ContentValues();
                values.put(MediaStore.Images.Media.TITLE, arquivo);
                values.put(MediaStore.Images.Media.DESCRIPTION, "Imagem capturada pela câmera");
                uriImagem = getContentResolver().insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);

                Intent i = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                i.putExtra(MediaStore.EXTRA_OUTPUT, uriImagem);
                i.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 1);
                startActivityForResult(i, CAPTURE_IMAGE_ACTIVITY_REQUEST_CODE);
            }
        });

        sendButton = (Button) findViewById(R.id.salvar);

        sendButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                Intent i = new Intent(MapsActivity.this, FotoActivity.class);
                startActivity(i);

                Intent intent = getIntent();
                String descricao = intent.getStringExtra("descricao");
                String tipo = intent.getStringExtra("tipo");
                UploadFileExecutor executor = new UploadFileExecutor();
                executor.execute(descricao, tipo);
            }
        });
        uploadButton = (Button) findViewById(R.id.upLoad);

        uploadButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                UploadFileExecutor executor = new UploadFileExecutor();
                executor.execute(bitmap);
            }
        });
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
    }



    private TypedFile getFileTyped(Bitmap image) {

        File folderPath = new File(getCacheDir(), "imageUploadFolder");
        if (!folderPath.exists()) {
            folderPath.mkdir();
        }

        try {
            File file = new File(folderPath, "img-" + System.currentTimeMillis() + ".png");
            Log.d(TAG, "File Path: " + file.toString());
            file.createNewFile();

            FileOutputStream out = null;

            out = new FileOutputStream(file);
            image.compress(Bitmap.CompressFormat.PNG, 85, out);
            out.flush();

            return new TypedFile("multipart/form-data", file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return null;
    }

    private NetworkInterceptor getNetworkInterceptor(){
        BaseApplication app = (BaseApplication)this.getApplication();
        return app.getNetworkInterceptor();
    }

    private class UploadFileExecutor extends AsyncTask<Object, Void, String>{

        ProgressDialog progressDialog;

        public UploadFileExecutor(){
            progressDialog = new ProgressDialog(MapsActivity.this);
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();

            progressDialog.setMessage("Enviando arquivo...");
            progressDialog.setIndeterminate(true);
            progressDialog.show();
        }

        @Override
        protected String doInBackground(Object... params) {

            if(!(params[0].equals(new String()))) {
                Bitmap bitmap = (Bitmap) params[0];
                TypedFile typedFile = getFileTyped(bitmap);

                if(typedFile != null){
                    try {
                        String result = getNetworkInterceptor().uploadImage(typedFile);
                        return result;
                    }catch (Exception ex){
                        Log.e(TAG, "Erro ao enviar itens..", ex);
                    }
                }

            }else{
                Intent i = getIntent();
                String tipo = i.getStringExtra("tipo");
                String descricao =i.getStringExtra("descricao");
                 String[] localizacao = new  String[2];
                localizacao[0] = String.valueOf(latitude);
                localizacao[1] = String.valueOf(longitude);
                if(descricao != null){
                    try {
                        String result = getNetworkInterceptor().uploadFile(localizacao,tipo,descricao);
                        return result;
                    }catch (Exception ex){
                        Log.e(TAG, "Erro ao enviar itens..", ex);
                    }
                }
            }
            Date date = new Date();
           SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMddhhmmss");
            String sampleSender = dateFormat.format(new Date());


            return null;
        }


        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            if(progressDialog.isShowing())
                progressDialog.dismiss();

            if(s == null){
                Toast.makeText(MapsActivity.this,"Erro ao envia arquivo", Toast.LENGTH_LONG).show();
                return;
            }

            Toast.makeText(MapsActivity.this, s, Toast.LENGTH_LONG).show();
            Log.i(TAG, "Arquivo enviado com sucesso!");
        }
    }

    protected void onActivityResult(int requestCode, int resultCode, Intent dados) {

        if (requestCode == CAPTURE_IMAGE_ACTIVITY_REQUEST_CODE) {
            if (resultCode == RESULT_OK) {
               // String idImagem = converteImagemUriParaArquivo(uriImagem, foto);
                try {
                    bitmap = MediaStore.Images.Media.getBitmap(getContentResolver(), uriImagem);
                    if(bitmap != null){
                        uploadImage.setImageBitmap(bitmap);
                    }
                } catch (IOException e) {
                    e.printStackTrace();


                }
            } else if (resultCode == RESULT_CANCELED) {
                Toast.makeText(this, "Não foi possivel recuperar imagem ", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(this, "Não foi possivel recuperar imagem ", Toast.LENGTH_SHORT).show();
            }
        }
    }

    /*
    public static String converteImagemUriParaArquivo(Uri uriImagem, Activity activity) {
        Cursor cursor = null;
        int idImagem = 0;

        try {
            String[] pacote = {
                    MediaStore.Images.Media.DATA,
                    MediaStore.Images.Media._ID,
                    MediaStore.Images.Thumbnails._ID,
                    MediaStore.Images.ImageColumns.ORIENTATION
            };

            cursor = activity.managedQuery(uriImagem, pacote, null, null, null);

            int indexColuna = cursor.getColumnIndexOrThrow(MediaStore.Images.Media._ID);
            int indexColunaThumb = cursor.getColumnIndexOrThrow(MediaStore.Images.Thumbnails._ID);
            int indexColunaArquivo = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);

            int tamanho = cursor.getCount();

            if (tamanho == 0) {

               // detalhesImg.setText("Sem imagens");
            } else {
                int idThumb = 0;
                if (cursor.moveToFirst()) {
                    idImagem = cursor.getInt(indexColuna);
                    idThumb = cursor.getInt(indexColunaThumb);
                    String caminho = cursor.getString(indexColunaArquivo);

                    String capturaImgDetalhes = "Detalhes da imagem:\n\n"
                            + "idImagem: " + idImagem + "\n"
                            + "IdThumb: " + idThumb + "\n"
                            + "Caminho: " + caminho + "\n";

                   // detalhesImg.setText(capturaImgDetalhes);
                }

            }
        } finally {
            if (cursor != null) {
                cursor.close();
            }
        }

        return "" + idImagem;
    }


  /*  public class RodarImagemSDCard extends AsyncTask<String, Void, Void> {

        private ProgressDialog dialog = new ProgressDialog(MapsActivity.this);
        Bitmap bMap;

        protected void onPreExecute() {
            dialog.setMessage("Executando SD Card");
            dialog.show();
        }
    }


        @Override
        protected Void doInBackground(String... urls) {

            Bitmap map = null;
            Bitmap novoMap = null;
            Uri u = null;

            try {
                u = Uri.withAppendedPath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "" + urls[0]);
                map = BitmapFactory.decodeStream(getContentResolver().openInputStream(u));
                if (map != null) {
                    novoMap = Bitmap.createScaledBitmap(map, 170, 170, true);
                    map.recycle();

                    if (novoMap != null) {
                        map = novoMap;
                    }
                }
            } catch (IOException e) {
                cancel(true);
            }
            return null;
        }

        protected void onPosExecute(Void uso) {
            dialog.dismiss();
            if (bMap != null) {
               // exibirImg.setImageBitmap(bMap);
            }
        }

*/

    private void showAlert() {
        final AlertDialog.Builder dialog = new AlertDialog.Builder(this);
        dialog.setTitle("Localização habilitada").setMessage("Sua localização está desabilitada! \n Por favor habilite sua localização para utilizar este app")
                .setPositiveButton("Configuração de localização", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface param, int paramInt) {
                        Intent i = new Intent(Settings.ACTION_LOCATION_SOURCE_SETTINGS);
                        startActivity(i);
                    }
                })
                .setNegativeButton("Cancelar", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface param, int paramInt) {

                    }
                });
        dialog.show();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;

        // Add a marker in Sydney and move the camera
        //LatLng sydney = new LatLng(-34, 151);
        // mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
        // mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));

        if(mMap != null){
            setUpMap();
        }

    }


    public void setUpMap() {
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            return;
        }

        mMap.setMyLocationEnabled(true);
        LocationManager locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
        if (locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER)) {

            Location currentLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
        }
        Criteria criteria = new Criteria();
        String provider = locationManager.getBestProvider(criteria, true);

        Location mylocation = locationManager.getLastKnownLocation(provider);
        mMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);

        if (mylocation != null) {
            criteria.setAccuracy(Criteria.ACCURACY_FINE);
            criteria.setPowerRequirement(Criteria.POWER_MEDIUM);
            latitude = mylocation.getLatitude();
            longitude = mylocation.getLongitude();
            LatLng latlng = new LatLng(latitude, longitude);
            mMap.moveCamera(CameraUpdateFactory.newLatLng(latlng));
            mMap.animateCamera(CameraUpdateFactory.zoomTo(20));
        }else{
            Toast.makeText(this, "Localização indisponível", Toast.LENGTH_SHORT).show();
        }

    }
}