package com.example.saemi.hackadengue;

/**
 * Created by SAEMI on 08/04/2016.
 */

import android.util.Log;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

public class FileHelper {
    private static final int BUFFER_SIZE = 8192 ;//2048;
    private static String TAG= FileHelper.class.getName().toString();
    private static String parentPath ="";

    public static boolean zip( String sourcePath, String destinationPath, String destinationFileName, Boolean includeParentFolder)  {
        new File(destinationPath).mkdir();

        try{
            if (!destinationPath.endsWith("/")) destinationPath+="/";
            String destination = destinationPath + destinationFileName;

            FileOutputStream fileOutputStream = new FileOutputStream(destination);
            ZipOutputStream zipOutputStream =  new ZipOutputStream(new BufferedOutputStream(fileOutputStream));

            if (includeParentFolder)
                parentPath=new File(sourcePath).getParent() + "/";
            else
                parentPath=sourcePath;

            zipFile(zipOutputStream, sourcePath);
            zipOutputStream.close();
        }
        catch (IOException ioe){
            Log.d(TAG,ioe.getMessage());
            return false;
        }

        return true;

    }

    private static void zipFile(ZipOutputStream zipOutputStream, String sourcePath) throws  IOException{

        java.io.File files = new java.io.File(sourcePath);
        java.io.File[] fileList = files.listFiles();

        String entryPath="";
        BufferedInputStream input=null;
        for (java.io.File file : fileList) {
            if (file.isDirectory()) {
                zipFile(zipOutputStream, file.getPath());
            } else {
                byte data[] = new byte[BUFFER_SIZE];
                FileInputStream fileInputStream = new FileInputStream(file.getPath());
                input = new BufferedInputStream(fileInputStream, BUFFER_SIZE);
                entryPath=file.getAbsolutePath().replace( parentPath,"");

                ZipEntry entry = new ZipEntry(entryPath);
                zipOutputStream.putNextEntry(entry);

                int count;
                while ((count = input.read(data, 0, BUFFER_SIZE)) != -1) {
                    zipOutputStream.write(data, 0, count);
                }
                input.close();
            }
        }



    }

}
