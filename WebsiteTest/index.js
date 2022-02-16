function ComponentTest(){
    return(
        <div>
            <h1>Welcome to the Coolest Bank</h1>
            <p>We have cool bank things!</p>
            <ol>
                <li>Money!</li>
                <li>Bills!</li>
                <li>Transactions!</li>
                <li>A database of everything pertaining to the above items, which we would be very sad if you hacked!</li>
            </ol>
        </div>
    )
}

ReactDOM.render(<ComponentTest />, document.getElementById("root"))