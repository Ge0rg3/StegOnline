import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdentifyFileTypeService {

  constructor() { }

  /*
    Regular Expression Identification for some common file signatures
    Manually compiled from data found at https://en.wikipedia.org/wiki/List_of_file_signatures
  */


    identifyFileType(hex: string): string[][] {
      /*
        Input: hex string
        Output: Array containing filetype ID and descriptoin
      */
      var results: string[][] = [];
      for (let details of this.fileSigs) {
          let extension: string = details[0];
          let description: string = details[1];
          let regexp: RegExp = details[2];
          if (hex.match(regexp)) {
            results.push([extension, description]);
          }
      }
      return results;
    }

  //ID - Description - Regex
  fileSigs: any[][] = [
    ['TGA', "Truevision TGA Bitmap 2", new RegExp("^54525545564953494F4E2D5846494C452E00", "i")],
    ['pcap', "Libpcap File Format", new RegExp("^(?:a1b2c3d4|d4c3b2a1)", "i")],
    ['pcapng', "PCAP Next Generation Dump File Format", new RegExp("^0a0d0d0a", "i")],
    ['rpm', "RedHat Package Manager (RPM) package", new RegExp("^edabeedb", "i")],
    ['sqlitedb', "SQLite Database", new RegExp("^53514c69746520666f726d6174203300", "i")],
    ['bin', "Amazon Kindle Update Package", new RegExp("^53503031", "i")],
    ['DBA', "Palm Desktop Calendar Archive", new RegExp("^BEBAFECA", "i")],
    ['DBA', "Palm Desktop To Do Archive", new RegExp("^00014244", "i")],
    ['TDA', "Palm Desktop Calendar Archive", new RegExp("^00014454", "i")],
    ['3gp', "3rd Generation Partnership Project 3GPP and 3GPP2 multimedia files", new RegExp("^(?:..){4}667479703367", "i")],
    ['tar.z', "Compressed File (Often tar zip) using Lempel-Ziv-Welch algorithm", new RegExp("^1F9D", "i")],
    ['tar.z', "Compressed File (Often tar zip) using LZH algorithm", new RegExp("^1FA0", "i")],
    ['bac', "File or tape containing a backup done with AmiBack on an Amiga", new RegExp("^4241434B4D494B454449534B", "i")],
    ['bz2', "Compressed file using Bzip2 algorithm", new RegExp("^425A68", "i")],
    ['gif', "Image file encoded in the Graphics Interchange Format (GIF)", new RegExp("^47494638(?:37|39)61", "i")],
    ['tiff', "Tagged Image File Format", new RegExp("^(?:49492A00|4D4D002A)", "i")],
    ['cr2', "Canon RAW Format Version 2 (Based on TIFF)", new RegExp("^49492A00100000004352", "i")],
    ['cin', "Kodak Cineon image", new RegExp("^802A5FD7", "i")],
    ['rnc', "Compressed file using Rob Northen Compression algorithm (v1)", new RegExp("^524E4301", "i")],
    ['rnc', "Compressed file using Rob Northen Compression algorithm (v2)", new RegExp("^524E4302", "i")],
    ['dpx', "SMPTE DPX Image", new RegExp("^(?:53445058|58504453)", "i")],
    ['exr', "OpenEXR Image", new RegExp("^762F3101", "i")],
    ['bpg', "Better Portable Graphics", new RegExp("^425047FB", "i")],
    ['jpg', "JPEG Raw", new RegExp("^FFD8FF(?:DB|EE)", "i")],
    ['jpg', "JPEG in JFIF format", new RegExp("^FFD8FFE000104A4649460001", "i")],
    ['jpg', "JPEG in Exif format", new RegExp("^FFD8FFE1....457869660000", "i")],
    ['ilbm', "IFF Interleaved Bitmap Image", new RegExp("^464F524D(?:.){8}494C424D", "i")],
    ['8svx', "IFF 8-Bit Sampled Voice", new RegExp("^464F524D(?:.){8}38535658", "i")],
    ['acbm', "Amiga Contiguous Bitmap", new RegExp("^464F524D(?:.){8}4143424D", "i")],
    ['anbm', "IFF Animated Bitmap", new RegExp("^464F524D(?:.){8}414E424D", "i")],
    ['anim', "IFF CEL Animation", new RegExp("^464F524D(?:.){8}414E494D", "i")],
    ['faxx', "IFF Facsimile Image", new RegExp("^464F524D(?:.){8}46415858", "i")],
    ['ftxt', "IFF Formatted Text", new RegExp("^464F524D(?:.){8}46545854", "i")],
    ['smus', "IFF Simple Musical Score", new RegExp("^464F524D(?:.){8}534D5553", "i")],
    ['cmus', "IFF Musical Score", new RegExp("^464F524D(?:.){8}434D5553", "i")],
    ['yuvn', "IFF YUV Image", new RegExp("^464F524D(?:.){8}5955564E", "i")],
    ['iff', "Amiga Fantavision Movie", new RegExp("^464F524D(?:.){8}46414E54", "i")],
    ['aiff', "Audio Interchange File Format", new RegExp("^464F524D(?:.){8}41494646", "i")],
    ['idx', "Index file to a file or tape containing a backup done with AmiBack on an Amiga.", new RegExp("^494E4458", "i")],
    ['lz', "lzip compressed file", new RegExp("^4C5A4950", "i")],
    ['exe', "DOS MZ executable file format and its descendants (including NE and PE)", new RegExp("^4D5A", "i")],
    ['zip', "zip file format or format based on it, e.g. jar, zip, jar, odt, ods, odp, docx, xlsx, pptx, vsdx, apk, aar", new RegExp("^504B0304", "i")],
    ['zip', "EMPTY zip file format or format based on it, e.g. jar, zip, jar, odt, ods, odp, docx, xlsx, pptx, vsdx, apk, aar", new RegExp("^504B0506", "i")],
    ['zip', "SPANNED zip file format or format based on it, e.g. jar, zip, jar, odt, ods, odp, docx, xlsx, pptx, vsdx, apk, aar", new RegExp("^504B0708", "i")],
    ['rar', "RAR archive version 1.50 onwards", new RegExp("^526172211A0700", "i")],
    ['rar', "RAR archive version 5.0 onwards", new RegExp("^526172211A070100", "i")],
    ['elf', "Executable and Linkable Format (ELF)", new RegExp("^7F454C46", "i")],
    ['png', "Image encoded in the Portable Network Graphics format", new RegExp("^89504E470D0A1A0A", "i")],
    ['class', "Java class file", new RegExp("^CAFEBABE", "i")],
    ['txt', "UTF-8 encoded Unicode byte order mark, commonly seen in text files.", new RegExp("^EFBBBF", "i")],
    ['machO32', "Mach-O binary (32-bit)", new RegExp("^FEEDFACE", "i")],
    ['machO32', "Mach-O binary (Reverse byte ordering scheme, 32-bit)", new RegExp("^CEFAEDFE", "i")],
    ['machO64', "Mach-O binary (64-bit)", new RegExp("^FEEDFACF", "i")],
    ['machO64', "Mach-O binary (Reverse byte ordering scheme, 64-bit)", new RegExp("^CFFAEDFE", "i")],
    ['jks', "JavakeyStore (JKS)", new RegExp("^FEEDFEED", "i")],
    ['ps', "PostScript", new RegExp("^25215053", "i")],
    ['pdf', "PDF document", new RegExp("^255044462D", "i")],
    ['asf', "Advanced Systems Format", new RegExp("^3026B2758E66CF11A6D900AA0062CE6C", "i")],
    ['sdi', "System Deployment Image, a disk image format used by Microsoft", new RegExp("^2453444930303031", "i")],
    ['ogg', "Ogg, an open source media container format", new RegExp("^4F676753", "i")],
    ['psd', "Photoshop Document file, Adobe Photoshop's native file format", new RegExp("^38425053", "i")],
    ['wav', "Waveform Audio File Format", new RegExp("^52494646(?:.){8}57415645", "i")],
    ['avi', "Audio Video Interleave video format", new RegExp("^52494646(?:.){8}41564920", "i")],
    ['mp3', "MPEG-1 Layer 3 file without an ID3 tag or with an ID3v1 tag", new RegExp("^FF FB", "i")],
    ['mp3', "MP3 file with an ID3v2 container", new RegExp("^494433", "i")],
    ['bmp', "BMP file, a bitmap format", new RegExp("^424D", "i")],
    ['iso', "ISO9660 CD/DVD image file", new RegExp("^(?:(?:..){32768})(?:^4344303031)", "i")],
    ['fits', "Flexible Image Transport System", new RegExp("^53494D504C4520203D(?:20){20}4344303031", "i")], //TODO: Test this
    ['flac', "Free Lossless Audio Codec", new RegExp("^664C6143", "i")],
    ['midi', "MIDI sound file", new RegExp("^4D546864", "i")],
    ['ms', "Compound File Binary Format: Used by older versions of Microsoft Office, e.g. xls, ppt, msg", new RegExp("^D0CF11E0A1B11AE1", "i")],
    ['dex', "Dalvik Executable", new RegExp("^6465780A30333500", "i")],
    ['vmdk', "VMDK Files", new RegExp("^4B444D", "i")],
    ['crx', "Google Chrome extension or packaged app", new RegExp("^43723234", "i")],
    ['fh8', "Freehand 8 document", new RegExp("^41474433", "i")],
    ['cwk', "AppleWorks 5 document", new RegExp("^05070000424F424F0507(?:00){11}01", "i")],
    ['cwk', "AppleWorks 6 document", new RegExp("^06070000424F424F0607(?:00){11}01", "i")],
    ['toast', "Roxio Toast disc image file, also some .dmg-files begin with same bytes", new RegExp("^(?:455202000000|8B455202000000)", "i")],
    ['dmg', "Apple Disk Image file", new RegExp("^7801730D626260", "i")],
    ['xar', "eXtensible ARchive format", new RegExp("^78617221", "i")],
    ['dat', "Windows Files And Settings Transfer Repository", new RegExp("^504D4F43434D4F43", "i")],
    ['nes', "Nintendo Entertainment System ROM file", new RegExp("^4E45531A", "i")],
    ['tar', "tar archive", new RegExp("^7573746172(?:003030|202000)", "i")], //TODO: Fix, needs 0x101 offset
    ['tox', "Open source portable voxel file", new RegExp("^746F7833", "i")],
    ['mlv', "Magic Lantern Video file", new RegExp("^4D4C5649", "i")],
    ['ms', "Windows Update Binary Delta Compression", new RegExp("^44434D0150413330", "i")],
    ['7z', "7-Zip File Format", new RegExp("^377ABCAF271C", "i")],
    ['gz', "GZIP compressed file", new RegExp("^1F8B", "i")],
    ['xz', "XZ compression utility", new RegExp("^FD377A585A0000", "i")],
    ['lz4', "LZ4 Frame Format", new RegExp("^04224D18", "i")],
    ['cab', "Microsoft Cabinet file", new RegExp("^4D534346", "i")],
    ['Q', "Microsoft compressed file in Quantum format, used prior to Windows XP.", new RegExp("^535A444488F02733", "i")],
    ['flif', "Free Lossless Image Format", new RegExp("^464C4946", "i")],
    ['webm', "Matroska media container, e.g. mkv, webm, mks, mka, mk3d", new RegExp("^1A45DFA3", "i")],
    ['stg', "\"SEAN : Session Analysis\" Training file.", new RegExp("^4D494C20", "i")],
    ['djvu', "DjVu document", new RegExp("^41542654464F524D(?:.){8}444A56", "i")],
    ['der', "DER encoded X.509 certificate", new RegExp("^3082", "i")],
    ['dcm', "DICOM Medical File Format", new RegExp("^4449434D", "i")],
    ['woff', "WOFF File Format 1.0", new RegExp("^774F4646", "i")],
    ['woff2', "WOFF File Format 2.0", new RegExp("^774F4632", "i")],
    ['xml', "eXtensible Markup Language when using the ASCII character encoding", new RegExp("^3c3f786d6c20", "i")],
    ['wasm', "WebAssembly binary format", new RegExp("^0061736d", "i")],
    ['lep', "Lepton compressed JPEG image", new RegExp("^cf8401", "i")],
    ['swf', "flash .swf", new RegExp("^4(?:3|6)5753", "i")],
    ['deb', "linux deb file", new RegExp("^213C617263683E", "i")],
    ['webp', "Google WebP image file", new RegExp("^52494646(?:.){8}57454250", "i")],
    ['uboot', "U-Boot / uImage. Das U-Boot Universal Boot Loader.", new RegExp("^27051956", "i")],
    ['rtf', "Rich Text Format", new RegExp("^7B5C72746631", "i")],
    ['tape', "Microsoft Tape Format", new RegExp("^54415045", "i")],
    // ['ts', "MPEG Transport Stream (MPEG-2 Part 1)", new RegExp("", "i")], //Too slow, has to check for "47" every 188 bytes :(
    ['m2p', "MPEG Program Stream", new RegExp("^000001BA", "i")],
    ['mpeg', "MPEG Program/Transport Stream", new RegExp("^000001B(?:A|3)", "i")],
    ['zlib', "zlib with no/low compression", new RegExp("^7801", "i")],
    ['zlib', "zlib with default compression", new RegExp("^789C", "i")],
    ['zlib', "zlib with best compression", new RegExp("^78DA", "i")],
    ['lzfse', "LZFSE - Lempel-Ziv style data compression algorithm using Finite State Entropy coding. OSS by Apple", new RegExp("^62767832", "i")],
    ['orc', "Apache ORC (Optimized Row Columnar) file format", new RegExp("^4F5243", "i")],
    ['avro', "Apache Avro binary file format", new RegExp("^4F626A01", "i")],
    ['rc', "RCFile columnar file format", new RegExp("^53455136", "i")],
    ['p25', "PhotoCap Object Templates", new RegExp("^65877856", "i")],
    ['pcv', "PhotoCap Vector", new RegExp("^5555aaaa", "i")],
    ['pbt', "PhotoCap Template (pbt, pdt, pea, peb, pet, pgt, pict, pjt, pkt, pmt)", new RegExp("^785634", "i")],
    ['par', "Apache Parquet columnar file format", new RegExp("^50415231", "i")],
    ['ez2', "Emulator Emaxsynth samples", new RegExp("^454D5832", "i")],
    ['ez3', "Emulator III synth samples", new RegExp("^454D5533", "i")],
    ['luac', "Lua bytecode", new RegExp("^1B4C7561", "i")],
    ['alias', "macOS file Alias (Symbolic Link)", new RegExp("^626F6F6B(?:00){4}6D61726B(?:00){4}", "i")],
    ['identifier', "Microsoft Zone Identifier for URL Security Zones", new RegExp("^5B5A6F6E655472616E736665725D", "i")],
    ['eml', "Email Message var5", new RegExp("^5265636569766564", "i")],
    ['tde', "Tableau Datasource", new RegExp("^20020162A01EAB0702000000", "i")],
    ['kdb', "KDB file", new RegExp("^3748030200000000583530394B4559", "i")],
    ['zst', "Zstandard compressed file", new RegExp("^28B52FFD", "i")],
    ['ooxml', "Microsoft Office Open XML Format, e.g. DOCX, PPTX, XLSX", new RegExp("^504B030414000600", "i")]
  ];

}
