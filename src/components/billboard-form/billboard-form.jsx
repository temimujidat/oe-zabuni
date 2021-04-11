import { Form, Button, Col } from "react-bootstrap";
import { Formik } from "formik";
import "./billboard-form.css";
import { createBillboardSchema } from "../../utils/form/yup-schemas";
import { useDispatch, useSelector } from "react-redux";
import { closeVerticalModalDisplay } from "../../redux/vertical-modal/verticalModalReducer";
import { resetBillboardFormData, showLgaData } from "../../redux/form/billboardFormReducer";
import { overheadModalContainer } from "../../redux/overhead-modal/overheadModalReducer";
import { setAlertContent } from "../../redux/alert/alertPopupReducer";
import { mutate } from "swr";
import billboardDataApi, { billboardRoute } from "../../utils/billboard-table/billboard-api";
import { useBillboardData } from "../../hooks/billboard-data-hook";

const BillboardForm = () => {
  const { billboardData } = useBillboardData(billboardRoute.get);
  const formDataState = useSelector(state => state.billboardForm);
  const { isEditing, formData, lgaData } = formDataState;
  const dispatch = useDispatch();
  return (
    <Formik
      validationSchema={createBillboardSchema}
      initialValues={formData}
      onSubmit={async (values, { setSubmitting }) => {
          console.log(values)
          setSubmitting(true);
          let updatedBillboardData = [...billboardData]
          if(isEditing){
            try {
              const updatedBillboard = await billboardDataApi.edit(values);
              const idx = billboardData.findIndex(billboard => billboard._id === updatedBillboard.billboardData._id);
              if(idx >= 0) {
                    updatedBillboardData.splice(idx,1,updatedBillboard.billboardData)
                const mutated = await mutate(billboardRoute.get,{billboardData: updatedBillboardData},false);
                console.log("mutaded",mutated)
                  dispatch(resetBillboardFormData())
                  dispatch(closeVerticalModalDisplay())
                  dispatch(setAlertContent('alert-success-edit-billboard'))
                  dispatch(overheadModalContainer('alert'))
              } 
            } catch (err) {
              console.log("mutate-error-edit-billboard",err)
                  setSubmitting(false);
                  alert("Failed to update billboard")
            }
          }else{
            try {
                  const createdBillboard = await billboardDataApi.create(values);
                  updatedBillboardData.push(createdBillboard.billboardData)
                  await mutate(billboardRoute.get,{billboardData: updatedBillboardData},false);
                  dispatch(closeVerticalModalDisplay())
                  dispatch(setAlertContent('alert-success-create-billboard'))
                  dispatch(overheadModalContainer('alert'))

            } catch (err) {
                  console.log("mutate-error-create-billboard",err)
                  setSubmitting(false);
                  alert("Failed to create billboard")
            }
          }
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
        isSubmitting
      }) => (
        <>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="formBasicName">
              <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Name"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.name && errors.name ? errors.name : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formBasicLocation">
              <Form.Label className="form-label">Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Location"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.location && errors.location ? errors.location : null}
                </Form.Text>
              </Form.Group>
            </Form.Row>
              <Form.Row>
                <Form.Group as={Col} controlId="controlSelectType">
                  <Form.Label className="form-label">Type</Form.Label>
                  <Form.Control
                    as="select"
                    name="type"
                    value={values.type}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="formf"
                  >
                    <option value="">Type</option>
                    <option value="led">LED</option>
                    <option value="lightbox">Lightbox</option>
                    <option value="bridge_panel">Bridge Panel</option>
                    <option value="eye_catcher">Eye Catcher</option>
                    <option value="mega_board">Mega board</option>
                    <option value="gantry">Gantry</option>
                    <option value="portrait">Portrait</option>
                    <option value="rooftop">Rooftop</option>
                    <option value="super48_sheet">Super 48 sheet</option>
                    <option value="ultrawave">Ultra wave</option>
                    <option value="video_wall">Video wall</option>
                    <option value="wall_drape">Wall Drape</option>
                    <option value="unipole">Unipole</option>
                  </Form.Control>
                  <Form.Text className="text-danger">
                    {touched.type && errors.type ? errors.type : null}
                  </Form.Text>
                </Form.Group>
                <Form.Group as={Col} controlId="controlSelectStatus">
              <Form.Label className="form-label">Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={values.status}
                onChange={handleChange}
                onBlur={handleBlur}
                className="formf"
              >
                <option value="">Status</option>
                <option value="active" className="active-status">Active</option>
                <option value="inactive" className="inactive-status">Inactive</option>
                <option value="vacant" className="vacant-status">Vacant</option>
              </Form.Control>
              <Form.Text className="text-danger">
                {touched.status && errors.status ? errors.status : null}
              </Form.Text>
            </Form.Group>
                
              </Form.Row>
              <Form.Row>
              <Form.Group as={Col} controlId="formBasicHeightInMetre">
              <Form.Label className="form-label">Height<span>  in metre</span></Form.Label>
                  <Form.Control
                    name="height_m"
                    value={values.height_m}
                    type="number"
                    min={3}
                    max={300}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Height (m)"
                    className="formfont"
                  />
                  <Form.Text className="text-danger">
                    {touched.height_m && errors.height_m ? errors.height_m : null}
                  </Form.Text>
                </Form.Group>
                <Form.Group as={Col} controlId="formBasicWidthInMetre">
                <Form.Label className="form-label">Width in metre</Form.Label>
              <Form.Control
                name="width_m"
                value={values.width_m}
                type="number"
                min={3}
                max={300}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Width (m)"
                className="formfont"
              />
              <Form.Text className="text-danger">
                {touched.width_m && errors.width_m ? errors.width_m : null}
              </Form.Text>
            </Form.Group>
              </Form.Row>
              <Form.Row>
              <Form.Group as={Col} controlId="formBasicHeightInPx">
              <Form.Label className="form-label">Height in px</Form.Label>
                  <Form.Control
                    name="height_px"
                    value={values.height_px}
                    type="number"
                    min={3}
                    max={300}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Height (px)"
                    className="formfont"
                  />
                  <Form.Text className="text-danger">
                    {touched.height_px && errors.height_px ? errors.height_px : null}
                  </Form.Text>
                </Form.Group>
                <Form.Group as={Col} controlId="formBasicWidthInPx">
                <Form.Label className="form-label">Width in px</Form.Label>
              <Form.Control
                name="width_px"
                value={values.width_px}
                type="number"
                min={3}
                max={300}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Width (px)"
                className="formfont"
              />
              <Form.Text className="text-danger">
                {touched.width_px && errors.width_px ? errors.width_px : null}
              </Form.Text>
            </Form.Group>
              </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="controlSelectCategory">
              <Form.Label className="form-label">Category</Form.Label>
                <Form.Control
                  as="select"
                  name="category"
                  value={values.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="formf"
                >
                  <option value="">Category</option>
                  <option value="billboard">Billboard</option>
                </Form.Control>
                <Form.Text className="text-danger">
                  {touched.category && errors.category ? errors.category : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="controlSelectClass">
              <Form.Label className="form-label">Class</Form.Label>
              <Form.Control
                as="select"
                name="class"
                value={values.class}
                onChange={handleChange}
                onBlur={handleBlur}
                className="formf"
              >
                <option value="">Class</option>
                <option value="digital">Digital</option>
                <option value="static">Static</option>
              </Form.Control>
              <Form.Text className="text-danger">
                {touched.class && errors.class ? errors.class : null}
              </Form.Text>
            </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="controlSelectRegion">
              <Form.Label className="form-label">Region</Form.Label>
                {/* <Form.Label>Example select</Form.Label> */}
                <Form.Control
                  as="select"
                  name="region"
                  value={values.region}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="formf"
                >
                  <option value="">Select Region</option>
                  <option value="southwest">Southwest</option>
                  <option value="southeast">Southeast</option>
                  <option value="northcentral">Northcentral</option>
                  <option value="northeast">Northeast</option>
                  <option value="northwest">Northwest</option>
                  <option value="southsouth">Southsouth</option>
                </Form.Control>
                <Form.Text className="text-danger">
                  {touched.class && errors.region ? errors.region : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="controlSelectState">
              <Form.Label className="form-label">State</Form.Label>
                  {/* <Form.Label>Example select</Form.Label> */}
                  <Form.Control
                    as="select"
                    name="state"
                    value={values.state}
                    onChange={(e) => {
                      console.log(e.target.value)
                      dispatch(showLgaData(e.target.value))
                      handleChange(e);
                    }}
                    onBlur={handleBlur}
                    className="formf"
                  >
                    <option value="">Select State</option>
                    <option value="fct">Abuja FCT</option>
                    <option value="abia">Abia</option>
                    <option value="adamawa">Adamawa</option>
                    <option value="akwa_ibom">Akwa Ibom</option>
                    <option value="anambra">Anambra</option>
                    <option value="bauchi">Bauchi</option>
                    <option value="bayelsa">Bayelsa</option>
                    <option value="benue">Benue</option>
                    <option value="borno">Borno</option>
                    <option value="cross_river">Cross River</option>
                    <option value="delta">Delta</option>
                    <option value="ebonyi">Ebonyi</option>
                    <option value="edo">Edo</option>
                    <option value="ekiti">Ekiti</option>
                    <option value="enugu">Enugu</option>
                    <option value="gombe">Gombe</option>
                    <option value="imo">Imo</option>
                    <option value="jigawa">Jigawa</option>
                    <option value="kaduna">Kaduna</option>
                    <option value="kano">Kano</option>
                    <option value="katsina">Katsina</option>
                    <option value="kebbi">Kebbi</option>
                    <option value="kogi">Kogi</option>
                    <option value="kwara">Kwara</option>
                    <option value="lagos">Lagos</option>
                    <option value="nassarawa">Nassarawa</option>
                    <option value="niger">Niger</option>
                    <option value="ogun">Ogun</option>
                    <option value="ondo">Ondo</option>
                    <option value="osun">Osun</option>
                    <option value="oyo">Oyo</option>
                    <option value="plateau">Plateau</option>
                    <option value="rivers">Rivers</option>
                    <option value="sokoto">Sokoto</option>
                    <option value="taraba">Taraba</option>
                    <option value="yobe">Yobe</option>
                    <option value="zamfara">Zamfara</option>
                  </Form.Control>
                  <Form.Text className="text-danger">
                    {touched.state && errors.state ? errors.state : null}
                  </Form.Text>
                </Form.Group>
            </Form.Row>
            <Form.Row>
            <Form.Group as={Col} controlId="controlSelectLga">
            <Form.Label className="form-label">Local Govt</Form.Label>
                  <Form.Control
                    as="select"
                    name="lga"
                    value={values.lga}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="formf"
                  >
                    <option value="">Select Lga</option>
                    {
                      lgaData.map(lga => <option key={lga} value={lga}>{lga}</option> )
                    }
                    </Form.Control>
                <Form.Text className="text-danger">
                  {touched.lga && errors.lga ? errors.lga : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formBasicCity">
              <Form.Label className="form-label">City</Form.Label>
                <Form.Control
                  type="text"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="City"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.city && errors.city ? errors.city : null}
                </Form.Text>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formBasicCoordinate">
              <Form.Label className="form-label">Co-ordinate</Form.Label>
                <Form.Control
                  type="text"
                  name="coordinate"
                  value={values.coordinate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Coordinate"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.coordinate && errors.coordinate ? errors.coordinate : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formBasicAmount">
              <Form.Label className="form-label">Amount</Form.Label>
                <Form.Control
                  type="text"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Amount"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.amount && errors.amount ? errors.amount : null}
                </Form.Text>
              </Form.Group>
            </Form.Row>
            <Form.Row>
              <Form.Group as={Col} controlId="formBasicFaces">
              <Form.Label className="form-label">Faces</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={50}
                  name="face"
                  value={values.face}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Faces"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.face && errors.face ? errors.face : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formBasicSlots">
              <Form.Label className="form-label">Slots</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={50}
                  name="slot"
                  value={values.slot}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Slots"
                  className="formfont"
                />
                <Form.Text className="text-danger">
                  {touched.slot && errors.slot ? errors.slot : null}
                </Form.Text>
              </Form.Group>
              <Form.Group as={Col} controlId="formBasicUnits">
              <Form.Label className="form-label">Units</Form.Label>
                <Form.Control
                  type="number"
                  min={1}
                  max={50}
                  name="unit"
                  value={values.unit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Units"
                  className="formfont"
                />
                {/* <Form.Label>Name</Form.Label> */}
                <Form.Text className="text-danger">
                  {touched.unit && errors.unit ? errors.unit : null}
                </Form.Text>
              </Form.Group>
            </Form.Row>
            <Button type="submit" block className="billboard-update-btn" disabled={isSubmitting}>
              {isEditing ? 'update' : 'create'}
            </Button>
          </Form>
        </>
      )}
    </Formik>
  );
};

export default BillboardForm;
