package com.example.saemi.hackadengue;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;

import java.util.HashMap;
import java.util.Map;

public class FotoActivity extends AppCompatActivity  implements AdapterView.OnItemSelectedListener, View.OnClickListener {
    Spinner spinner;
    String d;
    Map<String,String> mapa = new HashMap<String,String>();
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_foto);

        TextView descricao = (TextView)findViewById(R.id.descricao);
        d = descricao.getText().toString();
        Button b = (Button)findViewById(R.id.button);

        spinner = (Spinner) findViewById(R.id.spinner);
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this,
                R.array.ocorrencias, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(adapter);

        spinner.setOnItemSelectedListener(this);

        b.setOnClickListener(this);


    }

    @Override
    public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {

        String tipo = parent.getItemAtPosition(position).toString();
        String tipoNum = String.valueOf(position);

        mapa.put(tipo, tipoNum);


    }

    @Override
    public void onNothingSelected(AdapterView<?> parent) {

    }

    @Override
    public void onClick(View v) {

        Intent i = new Intent(FotoActivity.this, MapsActivity.class);
        i.putExtra("tipo", String.valueOf(mapa));
        i.putExtra("descricao",d);

        startActivity(i);
    }
}
