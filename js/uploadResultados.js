  
  export default sincronizarResultados = async () => {

    let continuar = true;

    debugger;
    

    setMensajes([]);

    setLoading(true);

    setMensaje(`Sincronizando resultados, conexión de red: ${networkState.type}, obteniendo conexión con backend...`);

    await getFecha().then((fecha) => {
      setMensaje(`$Sincronizando resultados, conexión de red: ${networkState.type} ... conectado ...`);
    }, () => {
      setMensaje(`Error conexión Backend`);
      setLoading(false);
      continuar = false;
    });

    if (!continuar) {
      return;
    }


    let tsdm = `@fecha${userSysId}${userCentro}${userAlmacen}`;
    let dmkey = `@storage_dm${userSysId}${userCentro}${userAlmacen}`;
    let fecha1 = new Date().toLocaleDateString();

    await _getAllKeys().then((allkeys) => {

      console.log(allkeys);

      allkeys?.forEach(async (tsdm) => {

        if (tsdm.includes(`@foto_${userSysId}_`)) {
          await _retrieveData(tsdm).then(async (m) => {

            let fileb64 = '';

            if (Platform.OS === 'web') {
              fileb64 = m?.split(',')[1]; // Quito el encabezado data:image/jpeg;base64,
            } else {
              const file = new File(m);
              fileb64 = file.base64Sync()
            }


            await callUploadFile(fileb64, tsdm).then(() => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado foto ${tsdm.slice(0, 10)}`);
                let mens = { mensaje };
                mens.mensaje = `sincronizado foto ${tsdm.slice(0, 10)}`;
                let mess = [];
                mess = mensajes;
                mess.push(mens);

                setMensajes(mess);

              } catch (error) {
                setMensaje('Error al sincronizar fotos');
                setLoading(false);
              } finally {
                setLoading(false);
              }
            })

          })
        }

        if (tsdm.includes(`AID${userSysId}.`)) {

          await _retrieveData(tsdm).then(async (m) => {

            await grabarAlmacen(m).then((resp) => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado almacén ${tsdm}`);
              } catch (error) {
                setMensaje('Error al sincronizar almacén');
                setLoading(false);
              } finally {
                setLoading(false);
              }

            },
              () => {
                setMensaje('Error al sincronizar almacén');
                setLoading(false);
              }
            );

          }
          )
        }

        if (tsdm.includes(`MID${userSysId}.`)) {

          await _retrieveData(tsdm).then(async (m) => {

            await grabarMercado(m).then((resp) => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado mercado ${tsdm}`);
              } catch (error) {
                setMensaje('Error al sincronizar mercado');
                setLoading(false);
              } finally {
                setLoading(false);
              }

            },
              () => {
                setMensaje('Error al sincronizar mercado');
                setLoading(false);
              }
            );

          }
          )

        }

        if (tsdm.includes(`MIDREP${userSysId}.`)) {

          await _retrieveData(tsdm).then(async (m) => {

            await grabarReportes(m).then((resp) => {
              try {
                _remove(tsdm);
                setMensaje(`sincronizado reporte mercado ${tsdm}`);
              } catch (error) {
                setMensaje('Error al sincronizar reporte mercado');
                setLoading(false);
              } finally {
                setLoading(false);
              }

            },
              () => {
                setMensaje('Error al sincronizar reporte mercado');
                setLoading(false);
              }
            );

          }
          )

        }

        if (tsdm.includes(`AIDREP${userSysId}.`)) {

          await _retrieveData(tsdm).then(async (m) => {

            await grabarReportes(m).then((resp) => {
              try {
                _remove(tsdm);
              } catch (error) {
                setMensaje(`sincronizado reporte almacén ${tsdm}`);
                setMensaje('Error al sincronizar reporte almacén');
                setLoading(false);
              } finally {
                setLoading(false);
              }

            },
              () => {
                setMensaje('Error al sincronizar reporte almacén');
                setLoading(false);
              }
            );

          }
          )

        }

      }
      )


    });

  }